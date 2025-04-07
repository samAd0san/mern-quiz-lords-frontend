import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Error from "../utils/Error";
import ShouldRender from "../utils/ShouldRender";
import { Link } from "react-router-dom";
import Loader from "../utils/Loader";
import UserContext from "../context/UserContext";
import { FaUser, FaLock, FaArrowRight } from "react-icons/fa";

function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setLoggedin } = useContext(UserContext);

  const onInputChange = (evt) => {
    const newUser = { ...user, [evt.target.name]: evt.target.value };
    setUser(newUser);
  };

  const onLogin = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const url = `${process.env.REACT_APP_BACKEND_URI}/users/signin`;
      const res = await axios.post(url, user);
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("userEmail", user.email);
      navigate("/");
      setLoggedin(true);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Image and welcome text */}
          <div className="md:w-1/2 bg-gradient-to-br from-primary to-secondary p-8 md:p-12 flex flex-col justify-center text-white">
            <div className="mb-8">
              <img 
                src="https://www.lords.ac.in/wp-content/uploads/2023/04/Website-Logo.png" 
                alt="Lords Institute Logo" 
                className="h-16 w-auto bg-white rounded-lg p-2 mb-6"
              />
              <h2 className="text-3xl font-bold mb-4">Welcome to Lords Quiz</h2>
              <p className="text-white/80 text-lg leading-relaxed">
                Test your knowledge, challenge yourself, and track your progress with our interactive quiz platform.
              </p>
            </div>
            
            <div className="mt-auto">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-white/20 p-3 rounded-full">
                  <FaUser size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Student Access</h3>
                  <p className="text-sm text-white/80">Take quizzes and track your results</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <FaLock size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Secure Platform</h3>
                  <p className="text-sm text-white/80">Your data is protected and secure</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Login form */}
          <div className="md:w-1/2 p-8 md:p-12">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-extrabold text-primary">
                  New to Lords Quiz?
                </h2>
                <p className="text-lg text-gray-600">
                  Create an account to get started
                </p>
              </div>

              <div className="flex justify-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-secondary hover:bg-primary transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl animate-pulse"
                >
                  Create Account
                  <FaArrowRight className="ml-2" />
                </Link>
              </div>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or sign in to your account</span>
                </div>
              </div>
            </div>

            <ShouldRender when={error}>
              <Error msg="Invalid email or password" />
            </ShouldRender>

            {loading && <Loader />}

            <form className="mt-8 space-y-6" onSubmit={onLogin}>
              <div className="rounded-md shadow-sm space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={user.email}
                      onChange={onInputChange}
                      className="pl-10 appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={user.password}
                      onChange={onInputChange}
                      className="pl-10 appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary focus:z-10 sm:text-sm transition-all duration-300"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-secondary transition-colors duration-300">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <FaUser className="h-5 w-5 text-white/80 group-hover:text-white transition-colors duration-300" />
                  </span>
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;