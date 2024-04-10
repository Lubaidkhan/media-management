const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const app = express();
var indexRouter = require('./routes/index.router');

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'./EmailTemplates/'))
// app.set('views', path.join(__dirname,'./EmailTemplates/Registration'))
const notFound = require('./errors/notFound');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Initialize DB
require('./initDB')();

// Add headers before the routes are defined      
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST,post, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'content-type, Origin, X-Requested-With, Content-Type, Accept, X-Access-Token, authorization');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware

  next();
});

app.use('/uploads', express.static(__dirname + '/uploads'));
// app.use(express.static(path.join(__dirname, 'EmailTemplates/CarelineEmail')));
// app.use(express.static(path.join(__dirname, 'EmailTemplates/Registration')));


app.get('/', (req, res) => {
  res.send('Api is working...');
});

app.use('/', indexRouter);


app.use(notFound)


// Settings 
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log('Server started on port ' + PORT + '...');
});

app.use((err, req, res, next) => {
  if(err.isOperational){
    return res.status(err.statusCode || 500).send({ message: err.name, isOperational: err.isOperational })
    
  }
  else{
    return res.status(err.statusCode || 500).send({ message: err.message, status: err.status, validCheck: err.validCheck })

  }
})

