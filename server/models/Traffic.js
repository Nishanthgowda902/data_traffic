import mongoose from 'mongoose';

const trafficSchema = new mongoose.Schema({
  month: {
    type: String,
    required: true,
    enum: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  },
  inbound: {
    type: Number,
    required: true,
    min: 0
  },
  outbound: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number
  },
  year: {
    type: Number,
    required: true,
    min: 2000,
    max: 2100
  }
}, {
  timestamps: true
});

// Calculate total before saving
trafficSchema.pre('save', function(next) {
  if (this.inbound !== undefined && this.outbound !== undefined) {
    this.total = this.inbound + this.outbound;
  }
  next();
});

// Create a compound index for month and year to ensure uniqueness
trafficSchema.index({ month: 1, year: 1 }, { unique: true });

export default mongoose.model('Traffic', trafficSchema);