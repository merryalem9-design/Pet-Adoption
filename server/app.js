const express = require('express');
const config = require('./config');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // <--- Added import for file system
const logger = require('./middleware/logger');
const authRoutes = require('./routes/authRoutes');
const shelterRoutes = require('./routes/shelterRoutes');
const adminRoutes = require('./routes/adminRoutes');
const petRoutes = require('./routes/petRoutes');
const shelterPetRoutes = require('./routes/shelterPetRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const petApplicationRoutes = require('./routes/petApplicationRoutes');
const shelterApplicationRoutes = require('./routes/shelterApplicationRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = config.PORT;

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.json());

// ==========================================
// CREATE UPLOADS FOLDER IF IT DOESN'T EXIST
// ==========================================
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir) && process.env.NODE_ENV === 'production') {
    fs.mkdirSync(uploadDir);
}
// ==========================================

app.use(cors()); 

app.use('/uploads', express.static('uploads'));

// ==========================================
// 1. ALL API ROUTES
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/shelters/my/pets', shelterPetRoutes);
app.use('/api/shelters/:shelterId/pets', shelterPetRoutes);
app.use('/api/shelters/:shelterId/applications', shelterApplicationRoutes);
app.use('/api/shelters', shelterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pets/:petId/applications', petApplicationRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/applications', applicationRoutes);


app.get('/api/health', (req, res) => {
  res.json({ status: 'I am working fine' });
});


app.use(express.static(path.join(__dirname, '../client/dist')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});


app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});