require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const shapeMunicipalityRouter = require('./routes/shapeMunicipality');
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});