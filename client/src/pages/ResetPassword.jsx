import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useContext, useRef, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  resetEmailSchema,
  otpSchema,
  newPasswordSchema,
} from "../validation/authSchema";

function ResetPassword() {
  const { backendUrl } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (values, { setSubmitting }) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        values,
      );

      if (data.success) {
        setEmail(values.email);
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitOtp = async (values, { setSubmitting, resetForm }) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-reset-otp",
        {
          email: email,
          otp: values.otp,
        },
      );

      if (data.success) {
        setOtp(values.otp);
        setIsOtpSubmitted(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");

      resetForm();
      inputRefs.current[0]?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitNewPassword = async (values, { setSubmitting }) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        {
          email,
          otp,
          newPassword: values.newPassword,
        },
      );

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-200 to-purple-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {/* Enter Email Form */}

      {!isEmailSent && (
        <Formik
          initialValues={{ email: "" }}
          validationSchema={resetEmailSchema}
          onSubmit={onSubmitEmail}
        >
          {({ isSubmitting }) => (
            <Form className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
              <h1 className="text-white text-2xl font-semibold text-center mb-4">
                Reset Password
              </h1>

              <p className="text-center mb-6 text-indigo-300">
                Enter your registered email address
              </p>

              <div className="mb-4">
                <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                  <img
                    src={assets.mail_icon}
                    alt="mail-icon"
                    className="w-3 h-3"
                  />

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

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 cursor-pointer bg-linear-to-br from-indigo-500 to-indigo-900 text-white rounded-full mt-3"
              >
                {isSubmitting ? "Sending..." : "Submit"}
              </button>
            </Form>
          )}
        </Formik>
      )}

      {/* OTP From */}

      {!isOtpSubmitted && isEmailSent && (
        <Formik
          initialValues={{ otp: "" }}
          validationSchema={otpSchema}
          onSubmit={onSubmitOtp}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
              <h1 className="text-white text-2xl font-semibold text-center mb-4">
                Reset Password OTP
              </h1>

              <p className="text-center mb-6 text-indigo-300">
                Enter the 6-digit code sent to your email id.
              </p>

              <div
                className="flex justify-between mb-2"
                onPaste={(e) => {
                  e.preventDefault();

                  const paste = e.clipboardData
                    .getData("text")
                    .replace(/\D/g, "")
                    .slice(0, 6);

                  setFieldValue("otp", paste);

                  paste.split("").forEach((char, index) => {
                    if (inputRefs.current[index]) {
                      inputRefs.current[index].value = char;
                    }
                  });

                  inputRefs.current[Math.min(paste.length, 5)]?.focus();
                }}
              >
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      key={index}
                      className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                      ref={(e) => (inputRefs.current[index] = e)}
                      value={values.otp[index] || ""}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");

                        const otpArray = values.otp.split("");

                        otpArray[index] = value;

                        const newOtp = otpArray.join("").slice(0, 6);

                        setFieldValue("otp", newOtp);

                        if (value && index < inputRefs.current.length - 1) {
                          inputRefs.current[index + 1]?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Backspace" &&
                          !values.otp[index] &&
                          index > 0
                        ) {
                          inputRefs.current[index - 1]?.focus();
                        }
                      }}
                    />
                  ))}
              </div>

              <ErrorMessage
                name="otp"
                component="p"
                className="text-red-400 text-xs mt-2"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 mt-4 text-white cursor-pointer bg-linear-to-r from-indigo-500 to-indigo-900 rounded-full"
              >
                {isSubmitting ? "Verifying..." : "Submit"}
              </button>
            </Form>
          )}
        </Formik>
      )}

      {/* Enter new Password */}

      {isOtpSubmitted && isEmailSent && (
        <Formik
          initialValues={{ newPassword: "" }}
          validationSchema={newPasswordSchema}
          onSubmit={onSubmitNewPassword}
        >
          {({ isSubmitting }) => (
            <Form className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
              <h1 className="text-white text-2xl font-semibold text-center mb-4">
                New Password
              </h1>

              <p className="text-center mb-6 text-indigo-300">
                Enter the new password below
              </p>

              <div className="mb-4">
                <div className="flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                  <img
                    src={assets.lock_icon}
                    alt="lock_icon"
                    className="w-3 h-3"
                  />

                  <Field
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    className="bg-transparent outline-none text-white w-full"
                  />
                </div>

                <ErrorMessage
                  name="newPassword"
                  component="p"
                  className="text-red-400 text-xs mt-1 ml-4"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 cursor-pointer bg-linear-to-br from-indigo-500 to-indigo-900 text-white rounded-full mt-3"
              >
                {isSubmitting ? "Resetting..." : "Submit"}
              </button>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}

export default ResetPassword;
