const User = require('../model/userModel');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwtToken');
const { generateRefreshToken } = require('../config/refreshToken');
const { validateMongoDbId } = require('../utils/validateMongoDbId');
const sendEmail = require('./emailController');
const APIFeatures = require('../utils/apiFeatures');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const createUser = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email });
  if (!findUser) {
    //create new user
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    //user already exist
    throw new Error('User already exist');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    return res.json({
      _id: findUser?._id,
      token: generateToken(findUser?._id),
      status: 'success',
      user: findUser,
    });
  } else {
    throw new Error('invalid credetials');
  }
});

// admin login

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new Error("Not Authorised");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

//handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.refreshToken) throw new Error('no Refresh Token in Cookie');
  const refreshToken = cookies.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error('No Refresh Token present in DataBase');
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error('something wrong with refresh token');
    }
    const accessToken = generateToken(user.id);
    res.json({ accessToken });
  });
});

// logout user
const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.refreshToken) throw new Error('no Refresh Token in Cookie');
  const refreshToken = cookies.refreshToken;

  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }

  await User.findOneAndUpdate(
    { refreshToken: refreshToken },
    { refreshToken: '' }
  );

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
  });

  return res.sendStatus(204);
});

//update user
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        mobile: req.body.mobile,
      },
      { new: true }
    );
    return res.json({
      status: 'success',
      updatedUser: updatedUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//get all user

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const features = new APIFeatures(User.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const users = await features.query;
    return res.json({
      status: 'success',
      allUsers: users,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//get a user
const getAUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    res.json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//delete a user
const deleteAUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const user = await User.findByIdAndDelete(id);
    res.json({
      status: 'success',
      message: 'user successfully deleted',
    });
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // validateMongoDbId(id);
  try {
    const blockuser = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );
    return res.json(blockuser);
  } catch (error) {
    throw new Error(error);
  }
});
const unBlockUser = asyncHandler(async (req, res) => {
  try {
    const unblockuser = await User.findByIdAndUpdate(
      req.params.id,
      {
        isBlocked: false,
      },
      { new: true }
    );
    return res.json(unblockuser);
  } catch (error) {
    throw new Error(error);
  }
});

const updatePassword = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { password } = req.body;
  validateMongoDbId(id);
  const user = await User.findById(id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('There is no user with this email.');
  }

  try {
    // Create a password reset token and save it to the user
    const token = await user.createPasswordResetToken();
    await user.save();

    // Construct the reset URL
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/user/resetPassword/${token}`;

    // Send the reset password email with the reset URL
    await sendEmail({
      email: email,
      subject: 'Password Reset Request',
      message: `You are receiving this email because you (or someone else) has requested the reset of the password for your account. Please click on the following link, or paste this into your browser to complete the process:\n\n${resetURL}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`,
    });

    // Respond with the token
    res.json({ token });
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error('token expired, please try again later!');
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

const getWishlist = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishList");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUser,
  loginAdmin,
  getAllUser,
  getAUser,
  deleteAUser,
  updateUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPassword,
  resetPassword,
  getWishlist,
};
