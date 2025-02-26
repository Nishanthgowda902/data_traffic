import express from 'express';
import Chart from '../models/Chart.js';

const router = express.Router();

// Get latest chart data
router.get('/latest', async (req, res) => {
  try {
    const chartData = await Chart.findOne().sort({ createdAt: -1 }).select('-_id -createdAt -updatedAt -__v');

    if (!chartData) {
      return res.json({
        FLASH: '0',
        EMERGENCY: '0',
        OPIMMEDIATE: '0',
        PRIORITY: '0',
        ROUTINE: '0',
        TOPSECRET: '0',
        SECRET: '0',
        CONFIDENTIAL: '0',
        RESTRICTED: '0',
        UNCLASSIFICATION: '0',
      });
    }

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add or update chart data
router.post('/', async (req, res) => {
  try {
    const existingChart = await Chart.findOne();

    if (existingChart) {
      await Chart.updateOne({}, req.body);
      return res.status(200).json(req.body);
    } else {
      const newChart = new Chart(req.body);
      const savedChart = await newChart.save();
      
      // Remove _id, createdAt, updatedAt, and __v from the response
      const { _id, createdAt, updatedAt, __v, ...filteredData } = savedChart.toObject();
      res.status(201).json(filteredData);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
