const {
  loginService,
  profileService,
  registerService,
} = require("../services/user");

const loginController = async (req, res) => {
  try {
    if (!req?.body || !req.body?.username || !req.body?.password)
      throw Error("missing some fields");
    const response = await loginService(req.body);
    res.status(200).send(response);
  } catch (error) {
    console.log(error.message);
    res.status(404).send({ message: error.message });
  }
};

const profileController = async (req, res) => {
  try {
    console.log(req.username);
    const username = req.username;
    const userProfile = await profileService(username);
    res.status(200).send(userProfile);
  } catch (error) {
    console.log(error.message);
    res.status(400).send({ message: error.message });
  }
};

const registerController = async (req, res) => {
  try {
    if (!req?.body || !req.body?.username || !req.body?.password)
      throw Error("missing some fields");
    const response = await registerService(req.body);
    res.status(200).send(response);
  } catch (error) {
    console.log(error.message);
    res.status(404).send({ message: error.message });
  }
};

module.exports = { loginController, registerController, profileController };
