import jwt from "jsonwebtoken";

const createTokenAndSaveCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_TOKEN, {
    expiresIn: "5d",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // will save from xss,
    secure: true,
    sameSite: "strict", //will save from csrf
  });
};

export default createTokenAndSaveCookie;
