const nodemailer = require('nodemailer')

const handleURLNotFound = (req, res, next) => {
    res.status(404)
    res.json({
      message: 'URL Not Found'
    })
  }

const response = (res, result, status, message, error, pagination)=>{
  res.status(status).json({
    status: 'Success!',
    code: status || 200,
    data: result,
    message: message || null,
    error : error || null,
    pagination : pagination
  })
}

const sendEmailVerification = async (emailTarget, token) => {
  const transporter = nodemailer.createTransport({
    host : `smtp.gmail.com`,
    port : 465,
    secure : true,
    auth : {
      user : process.env.ADMIN_EMAIL_ACCOUNT,
      pass : process.env.ADMIN_EMAIL_PASSWORD
    }
  })

  const info = await transporter.sendMail({
    from : `mailer.zwallet@gmail.com`,
    to : emailTarget,
    subject : `Zwallet User Registration Verification`,
    html : 
      `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap" rel="stylesheet">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
      </head>
      <style>
          body {
              display: flex;
              justify-content: center;
              padding: 0;
              margin: 0;
              background-color: #f6faff;
              font-family: Nunito Sans;
              color: #3A3D42;
          }
          .container {
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 500px;
              height: 700px;
              background-color: rgba(71, 58, 209, 0.06);
              padding: 20px;
              box-sizing: border-box;
          }
          .mail-title {
              display: flex;
              justify-content: center;
              margin: 0 0 20px 0;
          }

          .box {
              display: flex;
              align-items: center;
              flex-direction: column;
              margin: 20px;
              width: 400px;
              height: 300px;
              background-color: #f6faff;
          }

          .box-title {
              display: flex;
              text-align: center;
              padding: 40px;
          }

          a.btn-primary {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 150px;
              height: 50px;
              border-radius: 1rem;
              border: 1px #000 solid;
              background-color: #6379F4;
              color: #FFF;
              font-weight: 700;
              line-height: 25px;
          }

          a.btn-primary:hover {
              background-color: #FFF;
              color: #6379F4;
              cursor: pointer;
          }
      </style>
      <body>
          <div class="container">
              <h1 class="mail-title">Welcome to Zwallet!</h1>
              <h2 class="mail-title">So lovely to have you joined us!</h2>
              <div class="box">
                  <h4 class="box-title">Please click the CONFIRM button below
                      to verify your account.
                  </h4>
                  <a href="http://localhost:4000/email-verification/${token}" class="btn-primary">CONFIRM</a>
              </div>
          </div>
      </body>
      </html>`
  })
  console.log(info);
}


module.exports = {
    handleURLNotFound,
    response,
    sendEmailVerification
}