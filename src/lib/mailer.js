const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "cbd020eca41c16",
      pass: "4f38ca2952cc00"
    }
  })
