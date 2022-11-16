const Message = require("../models/Message");

const messageController = {
  getMessages: async (req, res, next) => {
    try {
      const { from, to } = req.body;
      const messages = await Message.find({
        users: {
          $all: [from, to],
        },
      }).sort({ createdAt: 1 });
      const projectedMessages = messages.map((message) => {
        if (
          (message.message.users[0].toString() === from) &
            (message.message.users[1].toString() === to) ||
          (message.message.users[1].toString() === from) &
            (message.message.users[0].toString() === to)
        ) {
          return {
            fromSelf: message.message.sender.toString() === from,
            message: message.message.text,
          };
        }
        return null;
      });
      // if null to remove from array projectedMessages
      const filteredMessages = projectedMessages.filter(
        (message) => message !== null
      );
      res.json(filteredMessages);
    } catch (ex) {
      next(ex);
    }
  },
  addMessage: async (req, res, next) => {
    try {
      const { from, to, message } = req.body;
      const data = await Message.create({
        message: {
          text: message,
          users: [from, to],
          sender: from,
        },
      });
      if (data) {
        return res.json(data);
      } else {
        return res.json({ msg: "Error adding message" });
      }
    } catch (ex) {
      next(ex);
    }
  },
};

module.exports = messageController;
