const express = require('express');
const app = express();

// app.get() --> Get Data
// app.post() --> Create Data
// app.put()  --> Update Data
// app.delete() --> Remove Data

app.get('/', (req, res) => {
  res.send('Hello World!!!');
});

app.get('/api/courses', (req, res) => {
  res.send([1, 2, 3]);
});

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
