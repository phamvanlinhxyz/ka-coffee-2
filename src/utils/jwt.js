const jwt = require('jsonwebtoken');

const generateAccessToken = ({ payload }) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);

  return token;
};

const isToken = ({ token }) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const attachTokenToRes = ({ res, user }) => {
  const token = generateAccessToken({ payload: user });

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    signed: true,
  });
};

module.exports = {
  generateAccessToken,
  isToken,
  attachTokenToRes,
};
