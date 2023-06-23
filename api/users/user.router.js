const {
  createUser,
  getUsers,
  getUserByUserId,
  updateUser,
  deleteUser,
} = require("./user.controller.js");
const router = require("express").Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserByUserId);
router.patch("/", updateUser); //what is router.patch?
/**PATCH allows for partial updates.
 * It means that you can send a request with only the fields that need to be updated,
 * rather than sending the complete resource representation.
 */
router.delete("/", deleteUser);

module.exports = router;
