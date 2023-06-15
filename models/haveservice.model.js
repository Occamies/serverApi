const mongoose = require('mongoose')

//skema beskriver en review
const haveServiceSchema = new mongoose.Schema({

  service: {
    type:String,
    required: [true, 'service missing']
  },
  
  desc: {
    type: String,
    required:[true, 'description missing']
  },

  servicePic: {
    type: String,
    required: [true, 'Service picture is missing']
  }

})

module.exports = mongoose.model('haveService', haveServiceSchema,"haveService")