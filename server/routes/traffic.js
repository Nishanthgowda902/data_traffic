import express from 'express';
import Traffic from '../models/Traffic.js';

const router = express.Router();

// Get traffic data by year
router.get('/:year', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const trafficData = await Traffic.find({ year }).sort('month');
    res.json(trafficData);
  } catch (error) {
    console.error('Error fetching traffic data:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add new traffic data
router.post('/', async (req, res) => {
  try {
    const { month, inbound, outbound, year } = req.body;

    // Validate required fields
    if (!month || inbound === undefined || outbound === undefined || !year) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Convert string values to numbers
    const numericInbound = Number(inbound);
    const numericOutbound = Number(outbound);
    const numericYear = Number(year);

    // Validate numeric values
    if (isNaN(numericInbound) || isNaN(numericOutbound) || isNaN(numericYear)) {
      return res.status(400).json({ message: 'Invalid numeric values provided' });
    }

    // Check if data for this month and year already exists
    const existingData = await Traffic.findOne({ month, year: numericYear });
    if (existingData) {
      return res.status(400).json({ message: 'Data for this month and year already exists' });
    }

    const trafficData = new Traffic({
      month,
      inbound: numericInbound,
      outbound: numericOutbound,
      year: numericYear
    });

    const savedData = await trafficData.save();
    res.status(201).json(savedData);
  } catch (error) {
    console.error('Error adding traffic data:', error);
    res.status(400).json({ message: error.message });
  }
});

export default router;