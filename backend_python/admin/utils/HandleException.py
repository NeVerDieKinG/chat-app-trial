
def HandleException(function):
    def wrapper(*args, **kwargs):
      return function(*args, **kwargs)
      # try:
      #   return function(*args, **kwargs)
      # except Exception as e:
      #   print("Error in Function :", function.__name__, '-', e)
      #   return {'Error': 'Internal Server Error'}, 500  # Return JSON response and status code
    wrapper.__name__ = function.__name__
    return wrapper