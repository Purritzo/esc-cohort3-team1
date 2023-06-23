const {
  createUser,
  getUsers,
  getUserByUserId,
  updateUser,
  deleteUser,
  login,
} = require("./user.controller.js");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation.js");

router.post("/", checkToken, createUser);
router.get("/", checkToken, getUsers);
router.get("/:id", checkToken, getUserByUserId);
router.patch("/", checkToken, updateUser); //what is router.patch?
/**PATCH allows for partial updates.
 * It means that you can send a request with only the fields that need to be updated,
 * rather than sending the complete resource representation.
 */
router.delete("/", checkToken, deleteUser);
router.post("/login", login); //why is login a post? Login doesnt need checkToken

module.exports = router;
