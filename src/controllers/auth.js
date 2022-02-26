const helper = require('../helper/helper')
const { authSchema } = require('../helper/validation')
const { logs } = require('../helper/loggerMessage')
const bcrypt = require('bcrypt')
const db = require('../models')
const Op = db.Sequelize.Op
const modelUser = db.user
const { Client } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const randomstring = require('randomstring')
const fs = require('fs')

const sendOtp = (number, id, key) => {
    try {
        let SESSION = './src/config/session.json'
        let sessionData
        if (fs.existsSync(SESSION)) {
            sessionData = require('../config/session.json')
        }

        const client = new Client({
            session: sessionData,
            puppeteer: {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--single-process',
                    '--disable-gpu',
                ],
            },
        })

        client.on('qr', (qr) => {
            qrcode.generate(qr, { small: true })
            console.log('QR RECEIVED', qr)
        })

        client.on('authenticated', (session) => {
            sessionData = session
            fs.writeFile(SESSION, JSON.stringify(session), (err) => {
                if (err) {
                    console.error(err)
                }
            })
        })

        client.on('auth_failure', (_session) => {
            console.log('auth failed')
        })

        client.on('ready', async () => {
            const message = `https://test-link-activation/id=${id}/key=${key}`
            //const message = `active your account click this link : https://bit.ly/arkademycv/key`
            const chatId = `${number}@c.us`
            await client
                .sendMessage(chatId, message)
                .then(() => {
                    console.log('success send verification to whatsapp-number')
                })
                .catch((e) => console.log(e))
        })

        client.on('disconnected', (x) => {
            // console.log('client disconnected')
            client.destroy()
        })

        client.initialize()
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    //note : validation pasword harus mengandung hurufbesar kecil dan simbol
    registerUser: async (req, res) => {
        try {
            const { number, email, password } = req.body
            await authSchema.validateAsync(req.body)
            const checkEmail = await modelUser.findOne({
                where: { email: email.toLowerCase(), active_status: true },
            })
            if (checkEmail) {
                return helper.response(res, 409, 'e-mail alredy used', null)
            } else {
                const key = randomstring.generate(7)
                const salt = bcrypt.genSaltSync(10)
                const hashPassword = bcrypt.hashSync(password, salt)
                const data = { number, email, password: hashPassword, key: key }
                let result = await modelUser.create(data)
                //send otp
                sendOtp(number, result.id, key)
                result = {
                    id: result.id,
                    phone: result.number,
                    email: result.email,
                }
                //logs(req.url, req.body, res.statusCode, data)
                return helper.response(res, 200, 'Register Success', result)
            }
        } catch (e) {
            console.log(e)
            let message = 'Bad Request'
            let status = 400
            if (e.isJoi === true) {
                message = e.details[0].message
                status = 422
            }
            return helper.response(res, status, message, null)
        }
    },
    activationUser: async (req, res) => {
        try {
            const { id, key } = req.query
            const user = await modelUser.findOne({
                where: { id: id, key: key, active_status: null },
            })
            if (user) {
                await modelUser.update(
                    { active_status: true },
                    { where: { id: id } }
                )
                return helper.response(res, 200, 'Activation success', null)
            } else {
                return helper.response(res, 400, 'User not found', null)
            }
        } catch (e) {
            console.log(e)
            return helper.response(res, 400, 'Bad Request', null)
        }
    },
    loginUser: async () => {},

    forgotPassword: async () => {},

    updatePassword: async () => {},
}
