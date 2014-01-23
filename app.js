var express = require('express');
var path = require('path');
var http = require('http');
var fs = require('fs');
var ejs = require('ejs');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('view engine', 'ejs');
  app.set('views', __dirname + '/views');
  //app.engine('html', require('ejs').renderFile);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

  // Setup local variables to be available in the views.
  app.locals.title = "Dependency Manager.";
  app.locals.description = "Manage your dependencies.";
  app.locals.env = process.env.NODE_ENV;
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.use(function (req, res, next) {
  fs.readFile('./models/dependencies.json', function (err, data) {
    console.log(err);
    if (err) throw err;

    res.locals.dependencies = data;
    next();
  });
});


app.get('/', function (req, res) {
  fs.readFile('./models/dependencies.json', function (err, data) {
    if (err) throw err;

    res.render('index.ejs', {
      dependencies: data
    });
  });
});

app.get('/api/dependencies', function (req, res) {
  fs.readFile('./models/dependencies.json', function (err, data) {
    console.log(err);
    if (err) throw err;

    res.json(data.toString());
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
  console.log("\nhttp://localhost:" + app.get('port') + "\n");
});
