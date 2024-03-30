import User from "../models/user.model.js";

export const getUserForSidebar = async (req, res) => {
  try {
    // added user from protectRoute middleware
    const loggedInUserId = req.user._id;

    // Find all user that is not equal to loggedInUserId
    // Sidebar in left : don't want to see himself
    // remove password in return user info.
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUserForSidebar controller :", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
