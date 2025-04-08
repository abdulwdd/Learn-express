const UserDB = require("../model/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const handleUserLogin = async (req, resp) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return resp.status(400).json({ "message": "Username and password not provided" });
  }

  const foundUser = await UserDB.findOne({ username }).exec();

  if (!foundUser) {
    return resp.status(401).json({ "message": "Incorrect username or password" });
  }

  const userMatch = await bcrypt.compare(password, foundUser.password);

  if (userMatch) {
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
       " UserInfo":{
        "username": foundUser.username,
        "roles": roles
       }
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    const refreshToken = jwt.sign(
      { "username": foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    foundUser.refreshToken = refreshToken;
    const resultLogin = await foundUser.save();

    resp.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    return resp.status(201).json({
      "message": "login successful",
      "authToken": `Access token is ${accessToken}`
    });
  } else {
    return resp.status(401).json({ "message": "Incorrect username or password" });
  }
};

module.exports =  {handleUserLogin} ;
