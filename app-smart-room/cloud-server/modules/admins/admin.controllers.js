const HttpStatus = require("http-status-codes");

function login(req, res) {
  return res.status(HttpStatus.OK).json({
    success: true,
    message: "JWT created",
    user: req.user.toAuthJSON()
  });
}

function tokenInfo(req, res) {
  // since we did not explicitly mention toAuthJSON()
  // the below will trigger toJSON() directly
  return res.status(HttpStatus.OK).json({
    success: true,
    message: "JWT verified",
    user: req.user
  });
}

module.exports = { login, tokenInfo };
