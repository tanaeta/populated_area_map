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

router.get('/post_offices', async (req, res) => {

  const query = `
    SELECT 
      zip_code,
      code,
      lat,
      lng,
      distance
    FROM 
      v_post_offices_with_distance
    ;
  `;
  console.log(query);

  try {
    const result = await client.query(query);
    const responseData = result.rows.map(row => ({
      zipCode: row.zip_code,
      code: row.code,
      lat: row.lat,
      lng: row.lng,
      distance: row.distance
    }));
    res.json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
});

module.exports = router;