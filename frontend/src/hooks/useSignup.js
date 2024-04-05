import toast from "react-hot-toast";
import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
  const [Loading, setLoading] = useState(false);
  const { AuthUser, setAuthUser } = useAuthContext();
  const signup = async ({
    FullName,
    UserName,
    Password,
    ConfirmPassword,
    Gender,
  }) => {
    // Check Input
    const IsSuccess = handleInputErrors({
      FullName,
      UserName,
      Password,
      ConfirmPassword,
      Gender,
    });
    if (!IsSuccess) return;

    // Loading to server
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          FullName,
          UserName,
          Password,
          ConfirmPassword,
          Gender,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      // Local LocalStorage
      localStorage.setItem("chat-user", JSON.stringify(data));

      // Context
      // After signup => set the user data => App.jsx will change value of "AuthUser" => Navigate to "/"
      setAuthUser(data);

      console.log(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return { Loading, signup };
};

export default useSignup;

function handleInputErrors({
  FullName,
  UserName,
  Password,
  ConfirmPassword,
  Gender,
}) {
  if (!FullName || !UserName || !Password || !ConfirmPassword || !Gender) {
    toast.error("Please fill all the fields");
    return false;
  }

  if (Password != ConfirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }

  if (Password.length < 6) {
    toast.error("Password must be at least 6 characters long");
    return false;
  }

  return true;
}
