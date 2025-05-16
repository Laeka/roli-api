const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema({
  hogar: { type: mongoose.Schema.Types.ObjectId, ref: 'Home', required: true },
  fecha: { type: Date, required: true },
  emocion: { 
    type: String, 
    enum: ['Neutro', 'Bien', 'Triste', 'Intrigado', 'Calmado', 'Temeroso'], 
    default: 'Neutro' 
  },
  nota: { type: String }
});

const DailyLog = mongoose.model('DailyLog', dailyLogSchema);

module.exports = DailyLog;