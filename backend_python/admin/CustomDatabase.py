import pandas as pd
import os

class CustomDatabase():
  def __init__(self, Name, DataSaveFldrDir='./Data'):
    self.Data_df = pd.DataFrame({})

    self.DataSaveDir = f'{DataSaveFldrDir}/{Name}.json'
    self.loadData()
  
  def loadData(self):
    if os.path.exists(self.DataSaveDir):
      self.Data_df = pd.read_json(
          self.DataSaveDir,
          orient='records',
          lines=True,
          dtype=False,
        )
  
  def saveData(self):
    if self.Data_df.shape[0] == 0:
      return
    self.Data_df.to_json(
      self.DataSaveDir,
      orient='records',
      lines=True,
      force_ascii=False,
    )
  
  
  def preLoadData(function):
    def wrapper(*args, **kwargs):
      self = args[0]
      self.loadData()
      Result = function(*args, **kwargs)
      return Result
    wrapper.__name__ = function.__name__
    return wrapper
  
  def postSaveData(function):
    def wrapper(*args, **kwargs):
      Result = function(*args, **kwargs)
      self = args[0]
      self.saveData()
      return Result
    wrapper.__name__ = function.__name__
    return wrapper

  @preLoadData
  def findData(self, Filter_dict={}, IsOutputList=False, DropKey_lst=None):
    if self.Data_df.shape[0] == 0: return None
    Data_df = self.Data_df
    for Key, MainVal in Filter_dict.items():
      # When input is like {'Key': {'neq': 'Val'}}
      # then OpType is 'neq' and Val is 'Val'
      if type(MainVal) == dict:
        OpType = list(MainVal.keys())[0]
        assert OpType in ['neq']
        Val = MainVal[OpType]
      else:
        # Without input of OpType => default 'eq'
        OpType = 'eq'
        Val = MainVal
      
      if type(Val) != list:
        if OpType == 'eq':
          Data_df = Data_df[Data_df[Key] == Val]
        else:
          Data_df = Data_df[Data_df[Key] != Val]
      else:
        if type(Data_df.iloc[0][Key]) == list:
          sData_df = Data_df.copy()
          for SubVal in Val:
            sData_df = sData_df[sData_df[Key].str.contains(
                SubVal, 
                regex=False
              )]
          sData_df = sData_df[sData_df[Key].str.len() == len(Val)]
          if OpType == 'eq':
            # if Val is list & Key is also list:
            # find row that exactly matches the list
            # while sequence can be different
            Data_df = sData_df
          elif OpType == 'neq':
            Data_df = Data_df[~Data_df.index.isin(sData_df.index)]
          
        else:
          if OpType == 'eq':
            # if Val is list & Key is not list:
            # find row that contains contains values in one of Val
            Data_df = Data_df[Data_df[Key].isin(Val)]
          elif OpType == 'neq':
            Data_df = Data_df[~Data_df[Key].isin(Val)]
    # if len(Data_df) > 1:
    #   raise Exception('Multiple data found!')
    if Data_df.shape[0] == 0:
      return None
    else:
      if DropKey_lst is not None:
        Data_df = Data_df.drop(columns=DropKey_lst)
      if IsOutputList == True:
        return Data_df.to_dict(orient='records')
      else:
        if Data_df.shape[0] == 1:
          return Data_df.iloc[0].to_dict()
        else:
          raise Exception('Multiple data found!')
  
  @preLoadData
  @postSaveData
  def addData(self, Data_dict, IdKey=None):
    if IdKey is not None:
      Data_dict[IdKey] = self.getNewDataId()
    WriteData_dict = {}
    for Key in Data_dict.keys():
      WriteData_dict[Key] = [Data_dict[Key]]
    self.Data_df = pd.concat([
        self.Data_df,
        pd.DataFrame(WriteData_dict)
      ], ignore_index=True)
    
    return Data_dict
  

  def getNewDataId(self):
    return str(int(len(self.Data_df) + 1))
  
  

  @preLoadData
  @postSaveData
  def modifyData(self, Data_dict, IdKey):
    Data_df = self.Data_df[self.Data_df[IdKey] == Data_dict[IdKey]]
    if Data_df.shape[0] == 0:
      return None
    
    TarInd = Data_df.index[0]
    self.Data_df.loc[TarInd] = Data_dict
    return True
    
  