const config = require("../config/config");
const twilio = require("twilio");

// configuracion twilio
const twilioClient = twilio(config.twilioAccountSID, config.twilioAuthToken);
const twilioSMSOPtions = {
  body: "Esto es un mensaje SMS de prueba usando Twilio desde  CoderHouse - C_44705",
  from: config.twilioSmsNumber,
  to: config.twilioToSmsNumber,
};

const twilioSMSOPtionspurchase = {
  body: "Gracias por su compra",
  from: config.twilioSmsNumber,
  to: config.twilioToSmsNumber,
};

const sendSMSpurchase = async () => {
  try {
    console.log("Enviando SMS usando Twilio account");
    console.log(twilioClient);
    const result = await twilioClient.messages.create(twilioSMSOPtionspurchase);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

const sendSMS = async (req, res) => {
  try {
    console.log("Enviando SMS usando Twilio account");
    console.log(twilioClient);
    const result = await twilioClient.messages.create(twilioSMSOPtions);
    res.send({ message: "Success", payload: result });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

module.exports = { sendSMS, sendSMSpurchase };
