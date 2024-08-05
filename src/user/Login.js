import axios from "axios";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Error from "../utils/Error";
import ShouldRender from "../utils/ShouldRender";
import { Link } from "react-router-dom";
import Loader from "../utils/Loader";
import UserContext from "../context/UserContext";

function Login() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setLoggedin } = useContext(UserContext)

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
      localStorage.setItem("token", res.data.token);
      navigate("/");
      setLoggedin(true);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-8 mb-8 bg-white rounded">
      <form
        onSubmit={onLogin}
        className="bg-white p-8 rounded-lg border border-secondary shadow-xl w-full max-w-md w-1/5"
      >
        <ShouldRender when={error}>
          <Error msg="Invalid Username or Password" />
        </ShouldRender>
        <h1 className="font-bold text-2xl mb-8 text-primary text-center">
          Log In to Your Account
        </h1>

        {loading && <Loader />}

        <div className="mb-4">
          <label className="block mb-1 font-semibold text-primary">Email</label>
          <input
            name="email"
            type="email"
            value={user.email}
            onChange={onInputChange}
            className="block border border-gray-300 w-full rounded-lg p-2"
            required
          />
        </div>

        <div className="mb-8">
          <label className="block mb-1 font-semibold text-primary">Password</label>
          <input
            name="password"
            type="password"
            value={user.password}
            onChange={onInputChange}
            className="block border border-gray-300 w-full rounded-lg p-2"
            required
          />
        </div>

        <div className="mb-4">
          <button
            type="submit"
            className="w-full bg-primary hover:bg-secondary text-white py-2 rounded-lg focus:outline-none"
          >
            Sign In
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:text-secondary">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
export default Login;