const mongoose = require('mongoose')

const trendSchema = new mongoose.Schema({
    nameoftrend1: { type: String, required: true },
    nameoftrend2: { type: String, required: true },
    nameoftrend3: { type: String, required: true },
    nameoftrend4: { type: String, required: true },
    nameoftrend5: { type: String, required: true }
})

module.exports = mongoose.model('Trend', trendSchema);