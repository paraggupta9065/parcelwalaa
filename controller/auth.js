const bcrypt = require('bcryptjs')
const otpGenerator = require('otp-generator')
const otpModel = require('../model/otp')
const userModel = require('../model/user')
const jwt = require('jsonwebtoken')
const shopModel = require('../model/shop')
const deliveryBoyModel = require('../model/deliveryBoy')
const request = require('request')
const { default: fetch } = require('node-fetch')

exports.sendOtp = async (req, res) => {
  // try {
  let { number } = req.body
  if (!number) {
    return res.status(404).json({
      msg: 'Number not found',
      status: 'fail'
    })
  }
  const otpCode = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false
  })

  const otp = await otpModel.findOne({ number: number })

  if (!otp) {
    const model = await otpModel.create({ otp: otpCode, number: number })
    console.log(model)
  } else {
    await otpModel.findOneAndUpdate(
      { number: number },
      { otp: otpCode, number: number }
    )
  }
  console.log(otpCode)
  console.log(typeof number)
  number = '91' + number

  const response = await fetch(
    'https://graph.facebook.com/v16.0/101959862818415/messages',
    {
      method: 'POST',
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: number,
        type: 'template',
        template: {
          name: 'otp_parcelwalaa',
          language: {
            code: 'en'
          },
          components: [
            {
              type: 'body',
              parameters: [
                {
                  type: 'text',
                  text: otpCode
                }
              ]
            }
          ]
        }
      }),

      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.whatsapp_token}`
      }
    }
  )
  console.log('otp started')

  const data = await response.json()
  console.log(data)

  if (data['error'] != null) {
    if (data['error']['code'] == 100) {
      return res.status(400).json({
        status: 'fail',
        error: data['error'],
        msg: 'Unabe to found on whatsapp'
      })
    }
    return res.status(400).json({
      status: 'fail',
      error: data['error'],
      msg: 'Something went wrong'
    })
  }

  return res.status(200).json({
    msg: 'otp sended successfully',
    status: 'sucess',
    number: number,
    code: otpCode
  })
  // } catch (error) {
  //   return res.status(400).json({
  //     status: 'fail',
  //     error: error,
  //     msg: 'Something went wrong'
  //   })
  // }
}

exports.verifyOtp = async (req, res) => {
  try {
    const { number, otpCode } = req.body
    if (!number) {
      return res.status(404).json({ status: 'fail', msg: 'Number not found' })
    }
    const otpFound = await otpModel.findOne({ number: number })

    if (!otpFound) {
      return res.status(400).json({ status: 'fail', msg: 'Otp Not Sended Yet' })
    }
    if (otpFound.otpExpiry < Date.now) {
      return res.status(400).json({ status: 'fail', msg: 'otp expired' })
    }
    const isVerified = await otpFound.isValidatedOtp(otpCode)

    // const isVerified = otpFound['otp'] == otpCode;

    if (!isVerified) {
      const isVerifiedPlain = otpFound.otp == otpCode
      if (!isVerifiedPlain) {
        return res.status(400).json({ status: 'fail', msg: 'Incorrect Otp' })
      }
    }
    const userFound = await userModel.findOne({ number: number })
    if (!userFound) {
      const { name, role } = req.body
      if (!name && !role) {
        return res
          .status(404)
          .json({ status: 'fail', msg: 'Please user not found create user' })
      }
      const userCreated = await userModel.create({
        name: name,
        number: number,
        role: role
      })
      const token = await userCreated.getJwtToken()
      return res.status(201).json({
        status: 'sucess',
        msg: 'User created succesfuly',
        token: token
      })
    }

    const token = await userFound.getJwtToken()

    await otpModel.findOneAndDelete({ number: number })

    if (userFound.role == 'shop') {
      const shop = await shopModel.findOne({ user_id: userFound._id })

      return res.status(200).json({
        status: 'sucess',
        role: userFound.role,
        shop: shop,
        msg: 'Login succesfuly',
        token: token
      })
    }
    if (userFound.role == 'deliveryBoy') {
      const driver = await deliveryBoyModel.findOne({ user_id: userFound._id })

      return res.status(200).json({
        status: 'sucess',
        role: userFound.role,
        driver: driver,
        msg: 'Login succesfuly',
        token: token
      })
    }

    return res.status(200).json({
      status: 'sucess',
      role: userFound.role,
      msg: 'Login succesfuly',
      token: token,
      user: userFound
    })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}

exports.setToken = async (req, res) => {
  try {
    const fmc_token = req.body.fmc_token
    const device_id = req.body.device_id
    const user_id = req.user._id
    const deviceExist = await userModel.findOne({
      _id: user_id,
      'tokens.deviceId': device_id
    })
    if (!deviceExist) {
      await userModel.findOneAndUpdate(
        { _id: user_id },
        { $push: { tokens: { deviceId: device_id, token: fmc_token } } }
      )
    }
    await userModel.findOneAndUpdate(
      { _id: user_id, 'tokens.deviceId': device_id },
      { $set: { 'tokens.$': { deviceId: device_id, token: fmc_token } } }
    )

    return res.status(200).json({
      status: 'sucess',
      msg: 'Token set succesfuly'
    })
  } catch (error) {
    return res.status(400).json({
      status: 'fail',
      error: error,
      msg: 'Something went wrong'
    })
  }
}
