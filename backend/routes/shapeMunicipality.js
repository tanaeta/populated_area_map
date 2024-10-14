const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const { Client } = require('pg');

const client = new Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
});

client.connect();

router.post('/shape_municipality', async (req, res) => {
  const { selectedPrefectures } = req.body;
  console.log('Received selected prefectures:', selectedPrefectures);

  const query = `
    SELECT 
      ST_AsGeoJSON(s.geom) AS geojson,
      p.municipalityname,
      p.totalpopulation,
      p.populationunder15
    FROM 
      prefecturemunicipality p
    JOIN 
      shape_municipality s
    ON 
      p.municipalitycode = CAST(s.n03_007 AS INTEGER)
    where ${selectedPrefectures.map((prefecture,index) =>{
      return `s.n03_001 = '${prefecture}' ${index == selectedPrefectures.length-1 ? '': 'or'}`
    }).join(' ')}
    ;
  `;
  console.log(query);

  try {
    const result = await client.query(query);
    const responseData = result.rows.map(row => ({
      geojson: JSON.parse(row.geojson),
      municipalityName: row.municipalityname,
      totalPopulation: row.totalpopulation,
      populationUnder15: row.populationunder15
    }));
    console.log("get data from db");
    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
});

module.exports = router;