import userModel from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.userId)
      .select(
        "-password -verifyOtp -verifyOtpExpireAt -resetOtp -resetOtpExpireAt",
      );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
