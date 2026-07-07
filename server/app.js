const express = require('express');
const config = require('./config');
const morgan = require('morgan');
const logger = require('./middleware/logger');
const authRoutes = require('./routes/authRoutes');
const shelterRoutes = require('./routes/shelterRoutes');
const errorHandler = require('./middleware/errorHandler');


const app = express();
const PORT = config.PORT;

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/shelters', shelterRoutes);
app.get('/api/health',(req,res) =>{
  res.json({ status : 'I am working fine' });
});
app.use(errorHandler);
app.listen(PORT, () =>{
  logger.info(`Server is running on port ${PORT}`);
});
