const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPassword
    },
    tls: {
        rejectUnauthorized: false // Deshabilitar la validación del certificado
    }
});

// verificar conexion con gmail
transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

const mailOptions = {
    from: 'Coder Test- ' + config.gmailAccount,
    to: config.gmailAccount,
    subject: "Correo de prueba",
    html: "<div><h1>Esto es un Test de envio de correos con Nodemailer!</h1></div>",
    attachments: []
}

const mailOptionsWithAttachments = {
    from: 'Coder Test c_44705 - ' + config.gmailAccount,
    to: config.gmailAccount,
    subject: "Correo de prueba",
    html: `
            <div>
                <h1 style="color:green">Esto es un Test de envio de correos con Nodemailer!</h1>
                <p>Ahora usando imagenes: </p>
                <img src="https://anpimarcos.com/wp-content/uploads/2020/08/gracias.png"/>
            </div>
    `,
    attachments: [
        {
            fileName: 'Gracias por su compra',
            path: __dirname + '/public/images/gracias.png',
            cid: 'gracias'
        }
    ]

}


const sendEmailpurchase = (ticket, productsNotAvailable,purchaserEmail) => {
    try {

        const mailOptionsPurchase = {
            from: 'Construworld ' + config.gmailAccount,
            to: purchaserEmail,
            subject: "Gracias por tu compra",
            html: `
            <div>
            <h1>Esto es info de tu compra!</h1>
            <p>Código de Ticket: ${ticket.code}</p>
            <p>Fecha de Compra: ${ticket.purchase_datetime}</p>
            <p>Monto Total: ${ticket.amount}</p>
            <p>Comprador: ${ticket.purchaser}</p>
            <p>Productos no disponibles:</p>
            <ul>
              ${productsNotAvailable.map(productId => `<li>${productId}</li>`).join('')}
            </ul>
          </div>    
            <div>
                <img src="https://anpimarcos.com/wp-content/uploads/2020/08/gracias.png"/>
            </div>
        `,
            attachments: []
        }

        let result = transporter.sendMail(mailOptionsPurchase, (error, info) => {
            if (error) {
                console.log(error);
               
            }
            console.log('Message send: %s', info.messageId);
            
        })

    } catch (error) {
        console.log(error);
        
    }
};

const sendEmail = (req, res) => {
    try {
        let result = transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).send({ message: "Error", payload: error })
            }
            console.log('Message send: %s', info.messageId);
            res.send({ message: "Success!!", payload: info })
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
    }
};

const sendEmailWithAttachments = (req, res) => {
    try {
        let result = transporter.sendMail(mailOptionsWithAttachments, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).send({ message: "Error", payload: error })
            }
            console.log('Message send: %s', info.messageId);
            res.send({ message: "Success!!", payload: info })
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
    }

}

const sendEmailrecovery = (token,recoveryEmail) => {
    try {

        const mailOptionsRecovery = {
            from: 'Recovery ' + config.gmailAccount,
            to: recoveryEmail,
            subject: "Recuperacion de contraseña",
            html: `
            <div>
            <h1>Hola para generar tu nueva contraseña haz clic en el siguiente enlace!</h1>
            <a href="http://localhost:8080/api/recovery/reset/${token}" style="padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Recuperar</a>
          </div>    
        `,
            attachments: []
        }

        let result = transporter.sendMail(mailOptionsRecovery, (error, info) => {
            if (error) {
                console.log(error);
               
            }
            console.log('Message send: %s', info.messageId);
            
        })

    } catch (error) {
        console.log(error);
        
    }
};

const sendEmailUsersDeletes = (userEmail,name) => {
    try {

        const mailOptions = {
            from: 'Admin ' + config.gmailAccount,
            to: userEmail,
            subject: "Eliminación de cuenta por inactividad",
            html: `
            <div>
              <h1>Tu cuenta ha sido eliminada por inactividad</h1>
              <p>Estimado usuario ${name},</p>
              <p>Lamentamos informarte que tu cuenta en nuestra plataforma ha sido eliminada debido a inactividad.</p>
              <p>Si crees que esto es un error, contáctanos.</p>
            </div>
          `
        }

        let result = transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).send({ message: "Error", payload: error })
            }
            console.log('Message send: %s', info.messageId);
            res.send({ message: "Success!!", payload: info })
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
    }
};

const sendEmailProductDelete = (userEmail,name,product) => {
    try {

        const mailOptions = {
            from: 'Admin ' + config.gmailAccount,
            to: userEmail,
            subject: "Eliminación de producto",
            html: `
            <div>
              <h1>Haz eliminado un producto</h1>
              <p>Estimado usuario ${name},</p>
              <p>Te informamos que haz eliminado un producto que tu creaste.</p>
              <p> ${product} </p>
              <p>Si crees que esto es un error, contáctanos.</p>
            </div>
          `
        }

        let result = transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(400).send({ message: "Error", payload: error })
            }
            console.log('Message send: %s', info.messageId);
            res.send({ message: "Success!!", payload: info })
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error, message: "No se pudo enviar el email desde:" + config.gmailAccount });
    }
};


module.exports = { sendEmailWithAttachments , sendEmail, sendEmailpurchase, sendEmailrecovery, sendEmailUsersDeletes ,sendEmailProductDelete }