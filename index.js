//const startupDebugger = require('debug')('app:startup');
//const dbDebugger = require('debug')('app:db');
const debug = require('debug')('app:general');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const logger = require('./logger');
const authenticator = require('./authenticator');
const express = require('express');
const app = express();

// Switching from console.log to debug
//console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
//console.log(`app: ${app.get('env')}`);
debug(`NODE_ENV: ${process.env.NODE_ENV}`);
debug(`app: ${app.get('env')}`);

app.use(express.json()); // req.body
//app.use(express.urlencoded()); // key=value&key=value -> req.body
app.use(express.urlencoded({ extended: true })); // key=value&key=value -> req.body
app.use(express.static('public'));
app.use(helmet());

// Configuration
//console.log('Application Name: ' + config.get('name'));
//console.log('Mail Server: ' + config.get('mail.host'));
//console.log('Mail Password: ' + config.get('mail.password'));
// Switching from console.log to debug
debug('Application Name: ' + config.get('name'));
debug('Mail Server: ' + config.get('mail.host'));
debug('Mail Password: ' + config.get('mail.password'));

if (app.get('env') === 'development') {
    app.use(morgan('dev'));
    //app.use(morgan('combined'));
    //app.use(morgan('tiny'));
    //console.log('Morgan enabled...');
    // Replacing with call to startup debugger declared above
    //startupDebugger('Morgan enabled...');
    // Switching to general debug namespace
    debug('Morgan enabled...');
}

// Db work...
//dbDebugger('Connected to the database...');

app.use(logger);

//app.use(authenticator);

// app.get() --> Get Data
// app.post() --> Create Data
// app.put()  --> Update Data
// app.delete() --> Remove Data

const courses = [
  { id: 1, name: 'course1'},
  { id: 2, name: 'course2'},
  { id: 3, name: 'course3'},
]

app.get('/', (req, res) => {
  res.send('Hello World!!!');
});

/*
app.get('/api/courses', (req, res) => {
  res.send([1, 2, 3]);
});*/

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

app.post('/api/courses', (req, res) => {
    // Moved to validateCourse() function
    /*const schema = Joi.object({
        name: Joi.string()
        .min(3)
        .required()
    });*/
    
  /*if (error) {
    // 400 Bad request 
    res.status(400).send(error.details[0].message);
    //res.status(400).send(result.error);
    return;
  }*/
    
  //  const result = schema.validate(req.body);
  //  console.log(result);
  const { error } = validateCourse(req.body); // = result.error  
    
  if (error) {
    // 400 Bad request 
    res.status(400).send(result.error.details[0].message);
    //res.status(400).send(result.error);
    return;
  }
  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

app.put('/api/courses/:id',  (req, res) => {
  // Look up the course
  // If not existing, return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  // 404 means object not found
  if (!course) res.status(404).send('The course with the given id was not found.');
    
  // Validate
  // If Invalid, return 400 - Bad request 
  //const result = validateCourse(req.body);
  //Referencing error value in result object with
  //object destructuring notation.
  const { error } = validateCourse(req.body); // = result.error
  
  if (error) {
    // 400 Bad request 
    res.status(400).send(error.details[0].message);
    //res.status(400).send(result.error);
    return;
  }
    
  // Update course
  course.name = req.body.name;
  // Return the updated course to the client
  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
      name: Joi.string()
      .min(3)
      .required()
  });
    
  const result = schema.validate(course);
  
  return schema.validate(course);
}

app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    // 404 means object not found
    if (!course) res.status(404).send('The course with the given id was not found.');
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
  // Look up the course
  // Not existing, return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  // 404 means object not found
  if (!course) res.status(404).send('The course with the given id was not found.');
  
  // Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  
  // Return the same course
  res.send(course);
});

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
