const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

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
    
  if (error) {
    // 400 Bad request 
    res.status(400).send(error.details[0].message);
    //res.status(400).send(result.error);
    return;
  }
    
    const result = schema.validate(req.body);
    console.log(result);
    
  if (result.error) {
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

app.delete('/api/courses/:id', (req, res =>) {
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
