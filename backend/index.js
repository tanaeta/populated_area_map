require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const shapeMunicipalityRouter = require('./api/shapeMunicipality');
const departmentStoresRouter = require('./api/departmentStores');
const postOfficesRouter = require('./api/postOffices');
const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:3000', 
  optionsSuccessStatus: 200
};

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use('/api', shapeMunicipalityRouter);
app.use('/api', departmentStoresRouter);
app.use('/api', postOfficesRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});