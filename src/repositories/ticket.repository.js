module.exports = class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }


  async createTicket(amount, purchaser, productsToBuy) {
    try {

      const newTicket = await this.dao.createTicket(amount, purchaser, productsToBuy);
      console.log('newTicket resposytory')
      console.log(newTicket)
      return newTicket;
    } catch (error) {
      console.log(`Error added Ticket: ${error}`);
      return [];
    }
  }

};