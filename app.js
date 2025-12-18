const express = require('express');
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));  


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');  
});


app.post('/calculate-bmi', (req, res) => {  
  const weight = parseFloat(req.body.weight);
  const height = parseFloat(req.body.height);

  if (weight <= 0 || height <= 0) {
    return res.send('<h3>Invalid input. Weight and height must be positive.</h3><a href="/">Back</a>');
  }

  const bmi = weight / (height * height);
  let category = '';
  let color = '';

  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'blue';
  } else if (bmi < 24.9) {
    category = 'Normal weight';
    color = 'green';
  } else if (bmi < 29.9) {
    category = 'Overweight';
    color = 'orange';
  } else {
    category = 'Obese';
    color = 'red';
  }

  res.send(`
    <h2>Your BMI: ${bmi.toFixed(2)}</h2>
    <h3 style="color:${color}">Category: ${category}</h3>
    <a href="/">Calculate again</a>
  `);
});


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
