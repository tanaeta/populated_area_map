const express = require('express');
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

router.get('/department_stores', async (req, res) => {

  const query = `
    SELECT 
      code,
      lat,
      lng,
      geom
    FROM 
      department_stores
    ;
  `;
  console.log(query);

  try {
    const result = await client.query(query);
    const responseData = result.rows.map(row => ({
      code: row.code,
      lat: row.lat,
      lng: row.lng,
      geom: row.geom
    }));
    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
});

module.exports = router;