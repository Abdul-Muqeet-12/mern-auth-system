import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
    .email("Invalid email address")
    .required("Email is required"),

  password: Yup.string().required("Password is required"),
});

export const registerSchema = Yup.object({
  name: Yup.string()
    .matches(
      /^[A-Za-z]+(?: [A-Za-z]+)*$/,
      "Name can only contain letters and spaces",
    )
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),

  email: Yup.string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
    .email("Please enter a valid email")
    .required("Email is required"),

  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number",
    )
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export const resetEmailSchema = Yup.object({
  email: Yup.string()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format")
    .email("Invalid email address")
    .required("Email is required"),
});

export const otpSchema = Yup.object({
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

export const newPasswordSchema = Yup.object({
  newPassword: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and number",
    )
    .min(8, "Password must be at least 8 characters")
    .required("New password is required"),
});
