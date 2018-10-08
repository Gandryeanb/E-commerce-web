// import nodemailer from 'nodemailer'
const nodemailer = require('nodemailer')

const mailInit = (cb) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: String(process.env.EMAIL_SENDER),
    pass: String(process.env.EMAIL_PW)
    }
  })
  cb(transporter)
}


export default {

  sendVerification (targetEmail, fname, VerifyToken) {
    mailInit(transporter => {
      const message = {
        from: String(process.env.EMAIL_SENDER),
        to: targetEmail,
        subject: "Verify your account E-commerce Gusti App",
        text: `Hey ${fname}, let's verify your email to use our app`,
        html: `<p><a href=http://localhost:8080/verify.html?${VerifyToken}> Verify your email </a></p>`
      }
    
      transporter.sendMail(message, function (err, info) {
        if(err) {
          console.log(err)
        } else {
          // console.log(info)
        }
      })
    })
  },
  sendWellcomeEmail (targetEmail, fname) {
    mailInit(transporter => {
      const message = {
        from: String(process.env.EMAIL_SENDER),
        to: targetEmail,
        subject: "Welcome to E-commerce Gusti App",
        text: `Thank's ${fname} for join e-commerce gusti portfolio`
      }
    
      transporter.sendMail(message, function (err, info) {
        if(err) {
        console.log(err)
        } else {
        // console.log(info)
        }
      })
    })
  }
}
