const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res
        .status(409)
        .json({ message: "Email already exist, try with another email." });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ userName, email, password: hashPassword });
    await newUser.save();

    res.status(200).json({ message: "Registration Successfully" });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Some error occured." });
  }
};

//login

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const isUserExist = await User.findOne({ email });

  try {
    if (!isUserExist) {
      return res
        .status(404)
        .json({ message: "User does not exist! Please register first." });
    }
    const passwordMatch = await bcrypt.compare(password, isUserExist.password);
    if (!passwordMatch) {
      return res
        .status(404)
        .json({ message: "Incorrect password! Please try again." });
    }

    const token = jwt.sign(
      {
        userID: isUserExist._id,
        role: isUserExist.role,
        email: isUserExist.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully.",
      user: {
        email: isUserExist.email,
        role: isUserExist.role,
        userId: isUserExist.id,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Some error occured." });
  }
};

//logout
const logoutUser = async (req, res) => {
  console.log(req.cookies);
  return res.clearCookie("token", { httpOnly: true, secure: true }).json({
    success: true,
    message: "Logged out successfully",
  });
};

// auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  // console.log(token);
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorised user!" });

  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decode;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorised user!" });
  }
};
module.exports = { registerUser, loginUser, logoutUser, authMiddleware };
