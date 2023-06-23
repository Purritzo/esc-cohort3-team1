const { verify } = require("jsonwebtoken");
module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get("authorization"); //huh?
    if (token) {
      token = token.slice(7); //bearer has 6 words and 1 space, so 7th index to get actual token
      verify(token, "qwe1234", (error, decoded) => {
        if (error) {
          res.json({
            success: 0,
            message: "Invalid token",
          });
        } else {
          next(); //call the next method
        }
      }); //second argument is the secret key
    } else {
      res.json({
        success: 0,
        message: "Access denied: u r unauthorized!!",
      });
    }
  },
};
