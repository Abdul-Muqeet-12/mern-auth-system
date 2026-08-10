import { useContext, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import { otpSchema } from "../validation/authSchema";

function EmailVerify() {
  axios.defaults.withCredentials = true;
  const { backendUrl, isLoggedIn, userData, getUserData } =
    useContext(AppContext);

  const navigate = useNavigate();

  const inputRefs = useRef([]);

  const handleInput = (e, index, values, setFieldValue) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) {
      return;
    }
    const otpArray = values.otp.split("");
    otpArray[index] = value;
    const newOtp = otpArray.join("").slice(0, 6);
    setFieldValue("otp", newOtp);
    if (value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index, values, setFieldValue) => {
    if (e.key === "Backspace") {
      const otpArray = values.otp.split("");
      if (otpArray[index]) {
        otpArray[index] = "";
        setFieldValue("otp", otpArray.join(""));
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        otpArray[index - 1] = "";
        setFieldValue("otp", otpArray.join(""));
      }
    }
  };

  const handlePaste = (e, setFieldValue) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    setFieldValue("otp", paste);
    const focusIndex = Math.min(paste.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const submitHandler = async (values, { setSubmitting, setFieldValue }) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        { otp: values.otp },
      );
      if (data.success) {
        toast.success(data.message);
        await getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      setFieldValue("otp", "");
      inputRefs.current[0]?.focus();
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedIn, userData, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />
      <Formik
        initialValues={{ otp: "" }}
        validationSchema={otpSchema}
        onSubmit={submitHandler}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
            <h1 className="text-white text-2xl font-semibold text-center mb-4">
              Email Verify OTP
            </h1>
            <p className="text-center mb-6 text-indigo-300">
              Enter the 6-digit code sent to your email id.
            </p>
            <div
              className="flex justify-between mb-2"
              onPaste={(e) => handlePaste(e, setFieldValue)}
            >
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    key={index}
                    value={values.otp[index] || ""}
                    className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
                    ref={(e) => {
                      inputRefs.current[index] = e;
                    }}
                    onChange={(e) =>
                      handleInput(e, index, values, setFieldValue)
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(e, index, values, setFieldValue)
                    }
                  />
                ))}
            </div>
            <ErrorMessage
              name="otp"
              component="p"
              className="text-red-400 text-xs mt-2 ml-1"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 text-white rounded-full mt-5 ${isSubmitting ? "bg-gray-500 cursor-not-allowed" : "bg-linear-to-r from-indigo-500 to-indigo-900 cursor-pointer"}`}
            >
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EmailVerify;
