const messageController = require("../controller/messageController");
const router = require("express").Router();

router.post("/getMessages", messageController.getMessages);
router.post("/addMessage", messageController.addMessage);

module.exports = router;
