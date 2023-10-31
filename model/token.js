const mongoose = require('mongoose')
const tokenSchema = mongoose.Schema(
  {
    deviceId: {
      type: String
    },
    token: {
      type: String,
      required:true
    },
    number: {
      type: Number
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Token', tokenSchema)
