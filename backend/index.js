const express = require('express');
const connectDB = require('./config/dbConnection');

const serviceRoutes = require('./routes/serviceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const websiteRoutes = require('./routes/websiteRoutes');


const cors = require('cors');
require('dotenv').config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.use('/api/services', serviceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/website', websiteRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
