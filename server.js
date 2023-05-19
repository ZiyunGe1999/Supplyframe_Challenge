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

// Catch all other routes request and return it to the index

// app.get('/watchlist', (req, res)=>{
//     console.log(`here ${req.url}`)
//     res.sendFile(path.join(__dirname, 'dist/stock-search/index.html'));
//   })

// app.get('/search/*', (req, res)=>{
//     console.log(`here ${req.url}`)
//     res.sendFile(path.join(__dirname, 'dist/stock-search/index.html'));
//   })

app.get('/', (req, res) => {
  console.log(`here ${req.url}`);
  res.sendFile(path.join(__dirname, 'static/index.html'));
})

// app.get('/*', (req, res)=>{
//     console.log(`here ${req.url}`)
//     if (req.url === '/') {
//         // res.sendFile(path.join(__dirname, 'dist/stock-search/index.html'));
//         res.redirect('/search/home');
//     }
//     else {
//         res.sendFile(path.join(__dirname, `dist/stock-search${req.url}`));
//     }
// })

// respond with "hello world" when a GET request is made to the homepage
// app.get('/', function (req, res){
//     res.send('Hello World')
// });