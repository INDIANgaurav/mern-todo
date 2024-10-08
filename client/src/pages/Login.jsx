import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axiosinstance";
import { validateEmail } from "../utils/helper";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
    if (!password) {
      setError("Please enter a password");
      return;
    }
    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        toast.success("you are now logged in");
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

      <div className=" mt-30  sm:mt-1  min-h-screen flex items-center   flex-col justify-center w-full  ">
        <h1 className="text-7xl font-bold text-center mb-4 "> Log in</h1>
        <div className="bg-white shadow-md rounded-3xl px-5 py-6 w-full sm:w-[27vw] ">
          <h1 className="text-2xl font-bold text-center mb-4 ">
            lets connect!
          </h1>
          <form onSubmit={handleLogin}>
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

            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            <a href="#" className="text-xs text-gray-600 hover:text-black ">
              Forgot Password
            </a>

            <button className="w-full py-2 px-4 rounded-md shadow-md text-sm font-medium bg-black text-white mb-2">
              Login
            </button>
            {/* login with account */}
            <div className="flex items-center justify-end">
              <Link
                to="/signup"
                className="text-xs text-blue-700 font-bold hover:scale-110 transition-all duration-200 ease-linear "
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
