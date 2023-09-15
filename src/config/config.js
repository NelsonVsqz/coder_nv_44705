const dotenv = require('dotenv');
const { Command } = require('commander');

const program = new Command();

program
    .option('-d, --debug', 'Variable para debug', false)
    .option('-p, --port <port>', 'Puerto del servidor', 8080)
    .option('--mode <mode>', 'Modo de trabajo', 'development')
program.parse();

console.log("Mode Option: ", program.opts().mode);

const environment = program.opts().mode;

dotenv.config({
    path: program.opts().mode === "production" ? "./.env.production" : "./.env.development"
});

module.exports = {
 environment: environment,    
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