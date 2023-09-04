const {ProductManager}  = require("../dao/factory");
const ProductRepository = require("../repositories/produtc.repository");
const productManager = new ProductManager()
const {TicketManager}  = require("../dao/factory");
const TicketRepository = require("../repositories/ticket.repository");
const ticketManager = new TicketManager()

const productsService = new ProductRepository(productManager)
const ticketService = new TicketRepository(ticketManager)

module.exports = {productsService,ticketService}