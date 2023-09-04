const dotenv = require('dotenv');
dotenv.config();

module.exports = {
 persistence : process.env.PERSISTENCE,
 mongourl: process.env.MONGO_URL,
 port: process.env.PORT,
 gmailAccount: process.env.GMAIL_ACCOUNT,
 gmailAppPassword: process.env.GMAIL_APP_PASSWD,
 twilioAccountSID: process.env.TWILIO_ACCOUNT_SID,
 twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
 twilioSmsNumber: process.env.TWILIO_SMS_NUMBER,
 twilioToSmsNumber: process.env.TWILIO_TO_SMS_NUMBER 
}