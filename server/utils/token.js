import jwt from "jsonwebtoken";

const generateToken = (res, user) => {
  return jwt.sign({ userId: user._id, firstname: user.firstname }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

export default generateToken;
