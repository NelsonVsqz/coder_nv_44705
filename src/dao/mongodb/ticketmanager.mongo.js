const Ticket = require("../models/ticket");

module.exports = class TicketManager {
  constructor() {
  }


  async createTicket(amount, purchaser, productsToBuy) {
    try {

      const newTicket = new Ticket({
        code: await this.generateUniqueCode(),
        purchase_datetime: new Date(),
        amount:amount,
        purchaser:purchaser,
        products: productsToBuy.map(p => ({
          product: p.product._id,
          quantity: p.quantity,
        })),
      });
  
      await newTicket.save();
      console.log('newTicket monto')
      console.log(newTicket)

      return newTicket;
    } catch (error) {
      console.log(`Error added Ticket: ${error}`);
      return [];
    }
  }

  async generateUniqueCode() {
    const CODE_LENGTH = 8;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
  
    for (let i = 0; i < CODE_LENGTH; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
  
    const existingTicket = await Ticket.findOne({ code });
  
    if (existingTicket) {
      return generateUniqueCode();
    }
  
    return code;
  }


};