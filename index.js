const http = require('http');
const si = require('systeminformation');

var express = require('express');
var app = express();


const port = 8000;

app.get('/api/getServices', (req, res) => {
  const queryData = req.query.name
  
  si.services(queryData).then((data) => { 
  res.json(data);
  });
 
});

app.get('/api/checkSite', (req, res) => {
  const queryData = req.query.url
  
  si.inetChecksite(queryData).then((data) => { 
  res.json(data);
  });
 
});
  
app.listen(port, () => console.log('Hello world'))

