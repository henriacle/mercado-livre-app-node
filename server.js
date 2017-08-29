var express = require('express');
var fullPath = require('path');
var request = require('request');
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', express.static(__dirname + '/dist/'));
app.set("views",__dirname+ '/dist/');

app.get('/items', function(req, res) {
    res.sendFile(fullPath.join(__dirname) + '/dist/index.html');
})

app.get('/api/items', function(req, res) {
    console.log(req.query.q);
    request('https://api.mercadolibre.com/sites/MLA/search?q=' + req.query.q, function(err, body) {
        if(err) {
            res.send(err);
        } else {
            var data = JSON.parse(body.body);

            var newData = data.results.slice(0, 4);

            data.results = newData;
            res.json(data);
        }
    })
});

app.get('/api/items/:id', function(req, res) {
    request('https://api.mercadolibre.com/items/' + req.params.id, function(err, body) {
        if(err) {
            res.send(err);
        } else {
            res.json(JSON.parse(body.body));
        }
    })
});

app.get('/api/items/:id/description', function(req, res) {
    request('https://api.mercadolibre.com/items/' + req.params.id, function(err, body) {
        if(err) {
            res.send(err);
        } else {
            res.json(JSON.parse(body.body));
        }
    })
});

app.listen(7200);