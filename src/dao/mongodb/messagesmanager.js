const mongoose = require('mongoose');

class MongoDB {
//  constructor(url) {
  constructor() {  
  //  this.url = url;
  }

/*
  connect() {
    mongoose.connect(this.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
      .then(() => {
        console.log('Connected to MongoDB Atlas1');
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error);
      });
  }
*/
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
