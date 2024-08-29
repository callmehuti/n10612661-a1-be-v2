const userModel = require("../../models/user.model");
const { hash, verify } = require("argon2");
const { sign } = require("jsonwebtoken");

const loginService = async (body) => {
  try {
    const { username, password } = body;
    const user = await userModel.findOne({ username });
    if (!user) throw Error("username or password wrong");
    const isMatch = await verify(user.password, password);
    if (!isMatch) throw Error("username or password wrong");
    const accessToken = sign({ username }, process.env.JWT_KEY, {
      expiresIn: "7d",
    });
    user.password = "";
    return {
      accessToken,
      userInfo: user,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const profileService = async (username) => {
  try {
    const user = await userModel.findOne({ username });
    if (!user) throw new Error("User is not found");
    user.password = "";
    return user;
  } catch (error) {
    throw error;
  }
};

const registerService = async (body) => {
  try {
    const user = await userModel.findOne({
      username: body.username,
    });
    const hashPassword = await hash(body.password);
    body.password = hashPassword;
    if (user) throw new Error("Username existed on db");
    const newUser = new userModel(body);
    await newUser.save();
    newUser.password = "";
    return newUser;
  } catch (error) {
    throw error;
  }
};

module.exports = { loginService, profileService, registerService };
