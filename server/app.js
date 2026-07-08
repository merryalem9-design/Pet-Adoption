const express = require('express');
const config = require('./config');
const morgan = require('morgan');
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
app.use('/api/auth', authRoutes);
app.use('/api/shelters', shelterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pets', petRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/shelters/:shelterId/pets', shelterPetRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/pets/:petId/applications', petApplicationRoutes);
app.use('/api/shelters/:shelterId/applications', shelterApplicationRoutes);
app.get('/api/health',(req,res) =>{
  res.json({ status : 'I am working fine' });
});
app.use(errorHandler);
app.listen(PORT, () =>{
  logger.info(`Server is running on port ${PORT}`);
});
