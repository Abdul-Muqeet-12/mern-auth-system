import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema, registerSchema } from "../validation/authSchema";

function Login() {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [state, setState] = useState("Login");

  const onSubmitHandler = async (values, { setSubmitting }) => {
    try {
      axios.defaults.withCredentials = true;

      if (state === "Sign Up") {
        const { data } = await axios.post(
          backendUrl + "/api/auth/register",
          values,
        );
        if (data.success) {
          setIsLoggedIn(true);
          await getUserData();
          navigate("/");
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(
          backendUrl + "/api/auth/login",
          values,
        );
        if (data.success) {
          setIsLoggedIn(true);
          await getUserData();
          navigate("/");
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-linear-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "Create your account"
            : "Login to your account!"}
        </p>
        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={state === "Sign Up" ? registerSchema : loginSchema}
          onSubmit={onSubmitHandler}
        >
          {({ isSubmitting }) => (
            <Form>
              {state === "Sign Up" && (
                <div className="mb-4">
                  <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                    <img src={assets.person_icon} alt="person-icon" />
                    <Field
                      type="text"
                      name="name"
                      placeholder="Enter Full Name"
                      className="bg-transparent outline-none text-white w-full"
                    />
                  </div>
                  <ErrorMessage
                    name="name"
                    component="p"
                    className="text-red-400 text-xs mt-1 ml-4"
                  />
                </div>
              )}

              <div className="mb-4">
                <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                  <img src={assets.mail_icon} alt="mail-icon" />
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter your Email"
                    className="bg-transparent outline-none text-white w-full"
                  />
                </div>
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-400 text-xs mt-1 ml-4"
                />
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                  <img src={assets.lock_icon} alt="lock-icon" />
                  <Field
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    className="bg-transparent outline-none text-white w-full"
                  />
                </div>
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-400 text-xs mt-1 ml-4"
                />
              </div>

              <p
                onClick={() => navigate("/reset-password")}
                className="text-indigo-500 cursor-pointer inline"
              >
                Forgot Password?
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2.5 rounded-full text-white font-medium mt-4 ${isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-linear-to-br from-indigo-500 to-indigo-900 cursor-pointer"}`}
              >
                {isSubmitting ? "Please wait..." : state}
              </button>
            </Form>
          )}
        </Formik>
        {state === "Sign Up" ? (
          <p className="text-gray-400 text-center text-sm mt-4">
            Already have an account?
            <span
              onClick={() => setState("Login")}
              className="text-blue-400 cursor-pointer underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-sm mt-4">
            Don't have an account?
            <span
              onClick={() => setState("Sign Up")}
              className="text-blue-400 cursor-pointer underline"
            >
              Sign Up
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;
