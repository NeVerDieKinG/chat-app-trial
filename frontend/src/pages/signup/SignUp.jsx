import { Link } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox";
import { useState } from "react";
import useSignup from "../../hooks/useSignup";

const SignUp = () => {
  const [Inputs, setInputs] = useState({
    FullName: "",
    UserName: "",
    Password: "",
    ConfirmPassword: "",
    Gender: "",
  });

  const { Loading, signup } = useSignup();

  const handleCheckboxChange = (Gender) => {
    setInputs({ ...Inputs, Gender });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(Inputs);
    await signup(Inputs);
  };

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-semibold text-center text-gray-300">
          Sign Up <span className="text-blue-500">ChatApp</span>
        </h1>
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="label p-2">
              <span className="text-base label-text">Full Name</span>
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full input input-bordered h-10"
              value={Inputs.FullName}
              onChange={(e) =>
                setInputs({ ...Inputs, FullName: e.target.value })
              }
            />
          </div>

          {/* User Name */}
          <div>
            <label className="label p-2">
              <span className="text-base label-text">UserName</span>
            </label>
            <input
              type="text"
              placeholder="johndoe"
              className="w-full input input-bordered h-10"
              value={Inputs.UserName}
              onChange={(e) =>
                setInputs({ ...Inputs, UserName: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div>
            <label className="label">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              type="Password"
              placeholder="Enter Password"
              className="w-full input input-bordered h-10"
              value={Inputs.Password}
              onChange={(e) =>
                setInputs({ ...Inputs, Password: e.target.value })
              }
            />
          </div>
          {/* Confirm Password */}
          <div>
            <label className="label">
              <span className="text-base label-text">Confirm Password</span>
            </label>
            <input
              type="Password"
              placeholder="Confirm Password"
              className="w-full input input-bordered h-10"
              value={Inputs.ConfirmPassword}
              onChange={(e) =>
                setInputs({ ...Inputs, ConfirmPassword: e.target.value })
              }
            />
          </div>

          {/* Gender Check Box*/}
          <GenderCheckbox
            onCheckboxChange={handleCheckboxChange}
            selectedGender={Inputs.Gender}
          />

          {/* Already have account? */}
          <Link
            to={"/login"}
            className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block"
          >
            Already have an account?
          </Link>

          {/* Sign Up Button */}
          {/* If loading => show spinning icon, rather than text "Sign Up" */}
          <div>
            <button className="btn btn-block btn-sm mt-2" disabled={Loading}>
              {Loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
