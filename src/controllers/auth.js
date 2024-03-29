const helper = require('../helper/helper')
const {
    authSchema,
    activationUser,
    loginValidation,
} = require('../helper/validation')
const { logs } = require('../helper/loggerMessage')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const db = require('../models')
// const { Client } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const randomstring = require('randomstring')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const { CustomError } = require('../middleware/errorHandler')
const modelUser = db.user
const modelProfile = db.profile

// const sendOtpWa = (number, id, key) => {
//     try {
//         let SESSION = './src/config/session.json'
//         let sessionData
//         if (fs.existsSync(SESSION)) {
//             sessionData = require('../config/session.json')
//         }

//         const client = new Client({
//             session: sessionData,
//             puppeteer: {
//                 headless: true,
//                 args: [
//                     '--no-sandbox',
//                     '--disable-setuid-sandbox',
//                     '--disable-dev-shm-usage',
//                     '--disable-accelerated-2d-canvas',
//                     '--no-first-run',
//                     '--no-zygote',
//                     '--single-process',
//                     '--disable-gpu',
//                 ],
//             },
//         })

//         client.on('qr', (qr) => {
//             qrcode.generate(qr, { small: true })
//             console.log('QR RECEIVED', qr)
//         })

//         client.on('authenticated', (session) => {
//             sessionData = session
//             fs.writeFile(SESSION, JSON.stringify(session), (err) => {
//                 if (err) {
//                     console.error(err)
//                 }
//             })
//         })

//         client.on('auth_failure', (_session) => {
//             console.log('auth failed')
//         })

//         client.on('ready', async () => {
//             const message = `https://test-link-activation/id=${id}/key=${key}`
//             //const message = `active your account click this link : https://bit.ly/arkademycv/key`
//             const chatId = `${number}@c.us`
//             await client
//                 .sendMessage(chatId, message)
//                 .then(() => {
//                     console.log('success send verification to whatsapp-number')
//                 })
//                 .catch((e) => console.log(e))
//         })

//         client.on('disconnected', (x) => {
//             // console.log('client disconnected')
//             client.destroy()
//         })

//         client.initialize()
//     } catch (e) {
//         console.log(e)
//     }
// }

const sendOtpEmail = (response, email, key) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
            user: `${process.env.EMAIL}`,
            pass: `${process.env.PASS}`,
        },
    })
    const mailOPtion = {
        from: `"Coffeshop verification`,
        to: `${email}`,
        subject: `Hello ${email}`,
        html: `<!doctype html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
          <head>
            <title>
            </title>
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style type="text/css">
              #outlook a{padding: 0;}
                          .ReadMsgBody{width: 100%;}
                          .ExternalClass{width: 100%;}
                          .ExternalClass *{line-height: 100%;}
                          body{margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}
                          table, td{border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;}
                          img{border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic;}
                          p{display: block; margin: 13px 0;}
            </style>
            <!--[if !mso]><!-->
            <style type="text/css">
              @media only screen and (max-width:480px) {
                                    @-ms-viewport {width: 320px;}
                                    @viewport {	width: 320px; }
                              }
            </style>
            <!--<![endif]-->
            <!--[if mso]> 
                <xml> 
                    <o:OfficeDocumentSettings> 
                        <o:AllowPNG/> 
                        <o:PixelsPerInch>96</o:PixelsPerInch> 
                    </o:OfficeDocumentSettings> 
                </xml>
                <![endif]-->
            <!--[if lte mso 11]> 
                <style type="text/css"> 
                    .outlook-group-fix{width:100% !important;}
                </style>
                <![endif]-->
            <style type="text/css">
              @media only screen and (min-width:480px) {
              .dys-column-per-40 {
                  width: 40% !important;
                  max-width: 40%;
              }
              .dys-column-per-60 {
                  width: 60% !important;
                  max-width: 60%;
              }
              }
              @media only screen and (min-width:480px) {
              .dys-column-per-100 {
                  width: 100.000000% !important;
                  max-width: 100.000000%;
              }
              }
              @media only screen and (min-width:480px) {
              .dys-column-per-100 {
                  width: 100.000000% !important;
                  max-width: 100.000000%;
              }
              }
              @media only screen and (min-width:480px) {
              .dys-column-per-100 {
                  width: 100.000000% !important;
                  max-width: 100.000000%;
              }
              }
            </style>
          </head>
          <body>
            <div>
              <table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='background:#30373b;background-color:#30373b;width:100%;'>
                <tbody>
                  <tr>
                    <td>
                      <div style='margin:0px auto;max-width:600px;'>
                        <table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='width:100%;'>
                          <tbody>
                            <tr>
                              <td style='direction:ltr;font-size:0px;padding:2px;text-align:center;vertical-align:top;'>
                                <!--[if mso | IE]>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:360px;">
        <![endif]-->
                                <div class='dys-column-per-60 outlook-group-fix' style='direction:ltr;display:inline-block;font-size:13px;text-align:left;vertical-align:top;width:100%;'>
                                  <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='vertical-align:top;' width='100%'>
                                    <tr>
                                      <td align='left' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
                                        <div style='color:#848789;font-family:Open Sans, Arial, sans-serif;font-size:12px;line-height:18px;text-align:left;text-decoration:none;'>
                                          Hi ${email}
                                        </div>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                                <!--[if mso | IE]>
        </td><td style="vertical-align:top;width:240px;">
        <![endif]-->
                                <div class='dys-column-per-40 outlook-group-fix' style='direction:ltr;display:inline-block;font-size:13px;text-align:left;vertical-align:top;width:100%;'>
                                  <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='vertical-align:top;' width='100%'>
                                    <tr>
                                      <td align='right' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
                                        <div style='color:#848789;font-family:Open Sans, Arial, sans-serif;font-size:12px;line-height:18px;text-align:right;text-decoration:none;'>
                                          <a href='#google.com' style='text-decoration:underline; color:#848789;' target='_blank'>
                                            Active your acount here
                                          </a>
                                        </div>
                                      </td>
                                    </tr>
                                  </table>
                                </div>
                                <!--[if mso | IE]>
        </td></tr></table>
        <![endif]-->
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso | IE]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
        <![endif]-->
              <div style='margin:0px auto;max-width:600px;'>
                <table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='width:100%;'>
                  <tbody>
                    <tr>
                      <td style='direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;'>
                        <!--[if mso | IE]>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
        <![endif]-->
                        <div class='dys-column-per-100 outlook-group-fix' style='direction:ltr;display:inline-block;font-size:13px;text-align:left;vertical-align:top;width:100%;'>
                          <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='vertical-align:top;' width='100%'>
                            <tr>
                              <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
                                <div style='color:#feae39;font-family:Open Sans, Arial, sans-serif;font-size:18px;font-weight:bold;line-height:20px;text-align:center;text-transform:uppercase;'>
                                  ALIFIA COFFEE SHOP
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td align='center' style='font-size:0px;padding:10px 25px;padding-top:20px;word-break:break-word;'>
                                <div style='color:#feae39;font-family:Courier New, Arial, sans-serif;font-size:50px;line-height:50px;text-align:center;text-transform:uppercase;'>
                                  activation code
                                </div>
                              </td>
                            </tr>
                          </table>
                        </div>
                        <!--[if mso | IE]>
        </td></tr></table>
        <![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]>
        </td></tr></table>
        <![endif]-->
              <!--[if mso | IE]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"><tr><td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
        <![endif]-->
              <div style='margin:0px auto;max-width:600px;'>
                <table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='width:100%;'>
                  <tbody>
                    <tr>
                      <td style='direction:ltr;font-size:0px;padding:20px 0;text-align:center;vertical-align:top;'>
                        <!--[if mso | IE]>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
        <![endif]-->
                        <div class='dys-column-per-100 outlook-group-fix' style='direction:ltr;display:inline-block;font-size:13px;text-align:left;vertical-align:top;width:100%;'>
                          <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='vertical-align:top;' width='100%'>
                            <tr>
                              <td align='center' style='font-size:0px;padding:10px 25px;word-break:break-word;' vertical-align='middle'>
                                <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='border-collapse:separate;line-height:100%;width:210px;'>
                                  <tr>
                                    <td align='center' bgcolor='#feae39' role='presentation' style='background-color:#feae39;border:none;border-radius:3px;cursor:auto;height:25px;padding:10px 25px;' valign='middle'>
                                      <a href='#' style='background:#feae39;color:#ffffff;font-family:Open Sans, Arial, sans-serif;font-size:17px;font-weight:bold;line-height:120%;margin:0;text-decoration:none;' target='_blank'>
                                        ${key}
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </div>
                        <!--[if mso | IE]>
        </td></tr></table>
        <![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]>
        </td></tr></table>
        <![endif]-->
              <table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='background:#30373b;background-color:#30373b;width:100%;'>
                <tbody>
                  <tr>
                    <td>
                      <div style='margin:0px auto;max-width:600px;'>
                        <table align='center' border='0' cellpadding='0' cellspacing='0' role='presentation' style='width:100%;'>
                          <tbody>
                            <tr>
                              <td style='direction:ltr;font-size:0px;padding:2px;text-align:center;vertical-align:top;'>
                                <!--[if mso | IE]>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;width:600px;">
        <![endif]-->
                                <div class='dys-column-per-100 outlook-group-fix' style='direction:ltr;display:inline-block;font-size:13px;text-align:left;vertical-align:top;width:100%;'>
                                  <table border='0' cellpadding='0' cellspacing='0' role='presentation' width='100%'>
                                    <tbody>
                                      <tr>
                                        <td style='padding:10px;vertical-align:top;'>
                                          <table border='0' cellpadding='0' cellspacing='0' role='presentation' style='' width='100%'>
                                            <!-- Social Icons -->
                                            <tr>
                                              <td align='left' style='font-size:0px;padding:10px 25px;word-break:break-word;'>
                                                <table border='0' cellpadding='0' cellspacing='0' style='cellpadding:0;cellspacing:0;color:#000000;font-family:Helvetica, Arial, sans-serif;font-size:13px;line-height:22px;table-layout:auto;width:100%;' width='100%'>
                                                  <tr>
                                                    <td align='center' valign='top'>
                                                      <table align='center' border='0' cellpadding='0' cellspacing='0'>
                                                        <tr>
                                                          <td valign='top'>
                                                            <a href='# Facebook' style='text-decoration:none;' target='_blank'>
                                                              <img alt='Facebook' border='0' height='26' src='https://www.sendwithus.com/assets/img/emailmonks/images/fb.png' style='display:block;font-family: Arial, sans-serif; font-size:10px; line-height:18px; color:#feae39; ' width='26' />
                                                            </a>
                                                          </td>
                                                          <td width='7'>
                                                            &nbsp;
                                                          </td>
                                                          <td valign='top'>
                                                            <a href='# Twitter' style='text-decoration:none;' target='_blank'>
                                                              <img alt='Twitter' border='0' height='26' src='https://www.sendwithus.com/assets/img/emailmonks/images/tw.png' style='display:block;font-family: Arial, sans-serif; font-size:10px; line-height:18px; color:#feae39; ' width='26' />
                                                            </a>
                                                          </td>
                                                          <td width='7'>
                                                            &nbsp;
                                                          </td>
                                                          <td valign='top'>
                                                            <a href='# Pinterest' style='text-decoration:none;' target='_blank'>
                                                              <img alt='Pinterest' border='0' height='26' src='https://www.sendwithus.com/assets/img/emailmonks/images/pint.png' style='display:block;font-family: Arial, sans-serif; font-size:10px; line-height:18px; color:#feae39; ' width='26' />
                                                            </a>
                                                          </td>
                                                          <td width='7'>
                                                            &nbsp;
                                                          </td>
                                                          <td valign='top'>
                                                            <a href='# Instagram' style='text-decoration:none;' target='_blank'>
                                                              <img alt='Instagram' border='0' height='26' src='https://www.sendwithus.com/assets/img/emailmonks/images/insta.png' style='display:block;font-family: Arial, sans-serif; font-size:10px; line-height:18px; color:#feae39; ' width='26' />
                                                            </a>
                                                          </td>
                                                          <td width='7'>
                                                            &nbsp;
                                                          </td>
                                                          <td valign='top'>
                                                            <a href='# Youtube' style='text-decoration:none;' target='_blank'>
                                                              <img alt='Youtube' border='0' height='26' src='https://www.sendwithus.com/assets/img/emailmonks/images/yt.png' style='display:block;font-family: Arial, sans-serif; font-size:10px; line-height:18px; color:#feae39; ' width='26' />
                                                            </a>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                            <!-- End Social Icons -->
                                            <!-- Footer Content -->
                                            <tr>
                                              <td align='center' style='font-size:0px;padding:5px;word-break:break-word;'>
                                                <div style='color:#848789;font-family:Open Sans, Arial, sans-serif;font-size:12px;line-height:18px;text-align:center;text-transform:uppercase;'>
                                                  <a href='# Privacy' style='text-decoration:underline; color:#848789;' target='_blank'>
                                                    PRIVACY STATEMENT
                                                  </a>
                                                  &nbsp;&nbsp;|&nbsp;&nbsp;
                                                  <a href='# TOS' style='text-decoration:underline; color:#848789;' target='_blank'>
                                                    TERMS OF SERVICE
                                                  </a>
                                                  &nbsp;&nbsp;|&nbsp;&nbsp;
                                                  <a href='# Returns' style='text-decoration:underline; color:#848789;' target='_blank'>
                                                    RETURNS
                                                  </a>
                                                </div>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td align='center' style='font-size:0px;padding:5px;word-break:break-word;'>
                                                <div style='color:#848789;font-family:Open Sans, Arial, sans-serif;font-size:12px;line-height:18px;text-align:center;text-transform:uppercase;'>
                                                  ©2‌019 company name. All Rights Reserved.
                                                </div>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td align='center' style='font-size:0px;padding:5px;word-break:break-word;'>
                                                <div style='color:#848789;font-family:Open Sans, Arial, sans-serif;font-size:12px;line-height:18px;text-align:center;text-transform:uppercase;'>
                                                  If you do not wish to receive any further emails from us, please
                                                  <span style='text-decoration:underline;'>
                                                    <a href='#' style='text-decoration:underline; color:#848789;' target='_blank'>
                                                      unsubscribe
                                                    </a>
                                                  </span>
                                                </div>
                                              </td>
                                            </tr>
                                            <!-- End Footer Content -->
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <!--[if mso | IE]>
        </td></tr></table>
        <![endif]-->
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </body>
        </html>`,
    }
    transporter.sendMail(mailOPtion, (err, _result) => {
        if (err) {
            console.log(err)
        }
    })
}

const checkEmail = (email) => {
    try {
        const check = modelUser.findOne({
            where: { email: email.toLowerCase(), active_status: true },
        })
        return check
    } catch (e) {
        console.log(e)
    }
}
const checkEmail2 = (email) => {
    try {
        const check = modelUser.findOne({
            where: { email: email.toLowerCase(), active_status: false },
        })
        return check
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    //FIXME: validation pasword harus mengandung hurufbesar kecil dan simbol
    //FIXME: add role on login, register, role: admin, user
    registerUser: async (req, res, next) => {
        try {
            const { number, email, role, password } = req.body
            await authSchema.validateAsync(req.body)
            const emailUsed = await checkEmail(email)
            if (emailUsed) {
                return helper.response(res, 409, 'e-mail alredy used', null)
            } else {
                const key = randomstring.generate(7)
                const salt = bcrypt.genSaltSync(10)
                const hashPassword = bcrypt.hashSync(password, salt)
                const data = {
                    number,
                    email,
                    password: hashPassword,
                    role,
                    key: key,
                    active_status: false,
                }

                const checkAccount = await checkEmail2(email)

                if (checkAccount) {
                    await modelUser.destroy({
                        where: { email: email },
                        force: true,
                    })
                }
                let result = await modelUser.create(data)
                //send otp
                sendOtpEmail(res, email, key)
                await modelUser.update(
                    { key: `${key}` },
                    { where: { id: result.id } }
                )
                result = {
                    id: result.id,
                    phone: result.number,
                    email: result.email,
                }
                logs(
                    'success register',
                    req.url,
                    req.body,
                    res.statusCode,
                    data
                )
                return helper.response(
                    res,
                    200,
                    'Register Succes, Check your email to active your account',
                    result
                )
            }
        } catch (e) {
            logs('failed register', req.url, req.body, res.statusCode, {})
            let message = `Bad Request ${e}`
            let status = 400
            if (e.isJoi === true) {
                message = e.details[0].message
                status = 422
            }
            helper.response(res, status, message, {})
            return next(new CustomError(message, 500))
        }
    },
    activationUser: async (req, res, next) => {
        try {
            const { id, key } = req.query
            await activationUser.validateAsync(req.query)

            const user = await modelUser.findOne({
                where: { id: id, key: key, active_status: false },
            })

            if (user) {
                await modelUser.update(
                    { active_status: true },
                    { where: { id: id } }
                )
                await modelProfile.create({ user_id: id })
                logs('success register', req.url, req.body, res.statusCode, {})
                return helper.response(res, 200, 'Activation success', null)
            } else {
                return helper.response(res, 400, 'User not found', null)
            }
        } catch (e) {
            let message = `Bad Request ${e}`
            let status = 400
            if (e.isJoi === true) {
                message = e.details[0].message
                status = 422
            }
            logs(
                `user activation failed`,
                req.url,
                req.body,
                res.statusCode,
                {}
            )
            helper.response(res, status, message, {})
            return next(new CustomError(message, 500))
        }
    },
    loginUser: async (req, res, next) => {
        try {
            const { email, password } = req.body

            await loginValidation.validateAsync(req.body)

            const user = await db.user.findOne({
                where: { email: email, deletedAt: null },
            })
            if (user) {
                const checkPass = bcrypt.compareSync(password, user.password)
                if (checkPass) {
                    const payload = {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        status: user.active_status,
                    }
                    token = jwt.sign(payload, 'intansyg', { expiresIn: '8h' })
                    const result = { ...payload, token }
                    logs(
                        `${user.email} success login`,
                        req.url,
                        req.body,
                        res.statusCode,
                        result
                    )
                    if (user.active_status == true) {
                        return helper.response(
                            res,
                            200,
                            'success login',
                            result
                        )
                    } else {
                        return helper.response(res, 400, 'user not active', {})
                    }
                } else {
                    logs(
                        `${user.email} wrong password`,
                        req.url,
                        req.body,
                        res.statusCode,
                        {}
                    )
                    return helper.response(res, 400, 'wrong password', null)
                }
            } else {
                logs(`user not found`, req.url, req.body, res.statusCode, {})
                return helper.response(res, 400, 'user not found', null)
            }
        } catch (e) {
            let message = `Bad Request ${e}`
            let status = 400
            if (e.isJoi === true) {
                message = e.details[0].message
                status = 422
            }
            logs(message, req.url, req.body, res.statusCode, {})
            helper.response(res, status, message, {})
            return next(new CustomError(message, 500))
        }
    },
    logoutUser: async () => {},
    forgotPassword: async () => {},
    updatePassword: async () => {},
}
