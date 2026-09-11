require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const incidentRoutes = require('./routes/incidentRoutes');

const { protect } = require('./middleware/authMiddleware');
const { authorize } = require('./middleware/roleMiddleware');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);

app.get('/api/test-protected', protect, (req, res) => {
  res.json({ success: true, message: `Hello user ${req.user.id}, your role is ${req.user.role}` });
});

app.get('/api/test-admin-only', protect, authorize('admin'), (req, res) => {
  res.json({ success: true, message: 'You are an admin, welcome!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});