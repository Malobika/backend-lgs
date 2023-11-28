const express = require('express')
const app = express()
const port = 8000
const db1 = require('./database.js')
app.use(express.json())
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
app.post('/gfg', (req, res) => {
  db1.createGrowFormulaGroup(req.body)
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

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})



