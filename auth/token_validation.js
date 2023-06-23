const { verify } = require("jsonwebtoken");
module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get("authorization"); //For now, we manually key in the token generated in authorization section

    // Case 1: Token found
    if (token) {
      token = token.slice(7); //bearer has 6 words and 1 space, so 7th index to get actual token
      verify(token, "qwe1234", (error, decoded) => {
        if (error) {
          res.json({
            success: 0,
            message: "Invalid token",
          });

          //TOKEN IS VALID
        } else {
          /**What next() does is that it calls the next middleware function
           * in user.router.js, we havae "router.get("/", checkToken, getUsers);"
           * Hence, we checkToken first, if its valid, next() moves us to getUsers middleware function
           */
          next(); //call the next method OH
        }
      });

      // Case 2: There is no token found in "authorization"
    } else {
      res.json({
        success: 0,
        message: "Access denied: u r unauthorized!!",
      });
    }
  },
};
