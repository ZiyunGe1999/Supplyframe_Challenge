var express = require('express');
var path = require('path');
var app = express();
var api = require('./server/routes/api');

var port = process.env.PORT || 8080;
// server listening on port 8080
app.listen(port, (req, res)=>{
  console.log(`RUNNING on port ${port}`);
});

// app.use(express.static(path.join(__dirname, 'dist/stock-search')));

app.use('/api/v1', api);

app.get('/*', (req, res)=>{
  console.log(`here ${req.url}`)
  if (req.url === '/') {
    res.sendFile(path.join(__dirname, 'static/index.html'));
  }
  else {
      res.sendFile(path.join(__dirname, `static${req.url}`));
  }
})