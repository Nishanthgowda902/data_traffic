import mongoose from 'mongoose';

const chartSchema = new mongoose.Schema({
  FLASH: {
    type: String,
    default: '0'
  },
  EMERGENCY: {
    type: String,
    default: '0'
  },
  OPIMMEDIATE: {
    type: String,
    default: '0'
  },
  PRIORITY: {
    type: String,
    default: '0'
  },
  ROUTINE: {
    type: String,
    default: '0'
  },
  TOPSECRET: {
    type: String,
    default: '0'
  },
  SECRET: {
    type: String,
    default: '0'
  },
  CONFIDENTIAL: {
    type: String,
    default: '0'
  },
  RESTRICTED: {
    type: String,
    default: '0'
  },
  UNCLASSIFICATION: {
    type: String,
    default: '0'
  }
}, {
  timestamps: true
});

export default mongoose.model('Chart', chartSchema);