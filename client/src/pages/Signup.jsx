import { Link, useNavigate } from "react-router-dom";
 
import { useState } from "react";
import Navbar from "../components/Navbar";
import { validateEmail } from "../utils/helper";
import axiosInstance from "../utils/axiosinstance";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!username) {
      setError("Please enter your name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter a password");
      return;
    }
    setError('');

    try {
      const response = await axiosInstance.post("/signup", {
        fullName: username,
        email,
        password,
      });

      if (response.data && response.data.error) {
        setError(response.data.message);
      }
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        toast.success("Signup successful, you can now login!");
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.data && error.reponse.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong, please try again ");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="  flex-col mt-30 sm:mt-1 min-h-screen flex items-center justify-center w-full">
          <h1 className="text-7xl font-bold text-center mb-4 ">
            {" "}
            Sign Up
          </h1>
        <div className="bg-white shadow-md rounded-3xl px-5 py-6 w-full sm:w-[27vw] ">
          <h1 className="text-2xl font-bold text-center mb-4 ">
            {" "}
            Lets Connect! 
          </h1>
          <form onSubmit={handleSignup}>
            {/* username */}
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username:{" "}
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
                className="shadow-md rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-black focus:border-black"
              />
            </div>
            {/* email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email:{" "}
              </label>
              <input
                type="text"
                name="email"
                id="email"

                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="shadow-md rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-black focus:border-black"
              />
            </div>
            {/* password */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password:{" "}
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="shadow-md rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-black focus:border-black"
              />
            </div>
{error && <p className="text-red-500 text-xs pb-1">{error}</p> }
            <button  type="submit" className="w-full py-2 px-4 rounded-md shadow-md text-sm font-medium bg-black text-white mb-2">
              Signup
            </button>
            {/* login with account */}
            <div className="flex items-center justify-end">
              <Link
                to="/login"
                className="text-xs text-blue-700 font-bold hover:scale-110 transition-all duration-200 ease-linear "
              >
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
