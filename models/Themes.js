const { Schema, model } = require('mongoose')

const themeSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    client: {
      type: String,
      required: true
    },
    logo: {
      type: String,
      required: true,
    },
    colors: {
      type: String,
    },
    status:{
      type: String,
      required: true
    },
    primaryColor: {
        type: String,
        default: '#c21920'
    }
  },
 
  {
    timestamps: true,
    versionKey: false
  }
)

module.exports = model('Themes', themeSchema)