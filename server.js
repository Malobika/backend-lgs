const express = require('express')
const app = express()
const port = 8000
const db1 = require('./database.js')
app.use(express.json())

const bodyParser = require('body-parser');
const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config();
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});



app.get('/', (req, res) => {
  db1.getNodes()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
  
})

// Get all edges
app.get('/edges', async (req, res) => {
  db1.getEdges()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
});
app.get('/nodes/:id', async (req, res) => {
  db1.getChildNodesNamesByEntityId(req.params.id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
});
// Get edges by entity-id
app.get('/edges/:id', async (req, res) => {
  db1.getEdgesByEntityId(req.params.id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
});

app.post('/nodes', (req, res) => {
  db1.createNodes(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})




app.delete('/nodes/:id', (req, res) => {
  db1.deleteNodes(req.params.id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})
app.put("/nodes/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;
  db1.updateNodes(id,body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});



 // Load environment variables from .env file


// PostgreSQL database configuration
const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432, // PostgreSQL default port
});

app.use(bodyParser.json());

// API endpoint to insert data into the "grow_formula_group" table
app.post('/gfg', async (req, res) => {
  const { grow_formula_group_name, comment } = req.body;

  try {
    // Insert data into the "grow_formula_group" table, excluding "grow_formula_group_id"
    const queryText = 'INSERT INTO grow_formula_group (grow_formula_group_name, comment) VALUES ($1, $2) RETURNING *';
    const values = [grow_formula_group_name, comment];

    const result = await pool.query(queryText, values);

    // Send the inserted data as the response
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})



