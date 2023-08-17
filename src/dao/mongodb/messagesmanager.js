const mongoose = require('mongoose');

class MongoDB {
  constructor() {  

  }
  saveMessage(user, message) {
    const Message = require('../models/messages');
    const newMessage = new Message({ user, message });
    newMessage.save()
      .then(() => {
        console.log('Message saved:', newMessage);
      })
      .catch((error) => {
        console.error('Error saving message:', error);
      });
  }
}

module.exports = MongoDB;
