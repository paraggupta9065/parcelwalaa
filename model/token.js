const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const tokenSchema = mongoose.Schema(
  {
    deviceId: {
      type: String
    },
    token: {
      type: String
    },
    number: {
      type: Number
    },
    createdAt: {
      type: Date,
      default: Date.now
      // expires: '1d'
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Token', tokenSchema)
