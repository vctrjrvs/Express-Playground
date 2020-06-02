const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

app.get('/', (req, res) => {
     res.send('Hello There Express Arena!')
})

app.get('/burgers', (req, res) => {
     res.send('We have juicy cheeseburgers and drinks!');
});

app.get('/pizza/pepperoni', (req, res) => {
     res.send('Your pizza is on the way!');
});

app.get('/pizza/pineapple', (req, res) => {
     res.send('We don\'t serve that here. Never call again!');
});

app.get('/echo', (req, res) => {
     const responseText = `Here are some details of your request:
       Base URL: ${req.baseUrl}
       Host: ${req.hostname}
       Path: ${req.path}
     `;
     res.send(responseText);
});

app.get('/queryViewer', (req, res) => {
     console.log(req.query);
     res.end(); //do not send any data back to the client
});

app.get('/greetings', (req, res) => {
     //1. get values from the request
     const name = req.query.name;
     const race = req.query.race;

     //2. validate the values
     if (!name) {
          //3. name was not provided
          return res.status(400).send('Please provide a name');
     }

     if (!race) {
          //3. race was not provided
          return res.status(400).send('Please provide a race');
     }

     //4. and 5. both name and race are valid so do the processing.
     const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;

     //6. send the response 
     res.send(greeting);
});

app.get('/sum', (req, res) => {
     const { a, b } = req.query

     if (!a) {
          return res.status(400).send('Please input a value for a')
     }
     if (!b) {
          return res.status(400).send('Please input a value for b')
     }

     const numberA = parseFloat(a)
     const numberB = parseFloat(b)

     if (Number.isNaN(numberA)) {
          return res.status(400).send('Must be a number')
     }
     if (Number.isNaN(numberB)) {
          return res.status(400).send('Must be a number')
     }

     const c = (numberA + numberB)

     res.status(200).send(`The sum of ${numberA} and ${numberB} is ${c}`)
})

app.get('/cipher', (req, res) => {
     const { text, shift } = req.query;

     if (!text) {
          return res.status(400).send('Please input text')
     }
     if (!shift) {
          return res.status(400).send('Please input shift')
     }

     const shiftNumber = parseFloat(shift);

     if (Number.isNaN(shiftNumber)) {
          return res.status(400).send('Must be a number')
     }

     const start = 'A'.charCodeAt(0);

     const cipher = text
          .split('')
          .map(character => {
               const code = character.charCodeAt(0)

               if (code < start || code > (start + 26)) {
                    return character
               }
               let difference = code - start;
               difference = difference + shiftNumber;
               difference = difference % 26

               const shiftCharacter = String.fromCharCode(start + difference);
               return shiftCharacter;
          })
          .join('')

     res.status(200).send(cipher)
})

app.get('/lotto', (req, res) => {
     const { numbers } = req.query;

     if (!numbers) {
          return res.status(400).send('Numbers required');
     }
     if (!Array.isArray(numbers)) {
          return res.status(400).send('Numbers must be an Array');
     }

     const guesses = numbers
          .map(num => parseInt(num))
          .filter(num => !Number.isNaN(num) && (num >= 1 && num <= 20));

     if (guesses.length != 6) {
          return res.status(400).send('must give six numbers')
     }

     const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);

     const winners = [];
     for (let i = 0; i < 6; i++) {
          const randomNum = Math.floor(Math.random() * stockNumbers.length);
          winners.push(stockNumbers[randomNum]);
          stockNumbers.splice(randomNum, 1)
     }

     let comparison = winners.filter(num => !guesses.includes(num));

     let responseText;

     switch (comparison.length) {
          case 0:
               responseText = "Wow! Unbelievable! You could have won the mega millions!";
          case 1:
               responseText = "Congratulations! You win $100!";
          case 2:
               responseText = "Congratulations, you win a free ticket";
          default:
               responseText = "Sorry, you lose";
     }

     res.send(responseText)
})

app.get('/grade', (req, res) => {
     // get the mark from the query
     const { mark } = req.query;

     // do some validation
     if (!mark) {
          // mark is required
          return res
               .status(400)
               .send('Please provide a mark');
     }

     const numericMark = parseFloat(mark);
     if (Number.isNaN(numericMark)) {
          // mark must be a number
          return res
               .status(400)
               .send('Mark must be a numeric value');
     }

     if (numericMark < 0 || numericMark > 100) {
          // mark must be in range 0 to 100
          return res
               .status(400)
               .send('Mark must be in range 0 to 100');
     }

     if (numericMark >= 90) {
          return res.send('A');
     }

     if (numericMark >= 80) {
          return res.send('B');
     }

     if (numericMark >= 70) {
          return res.send('C');
     }

     res.send('F');
});

app.listen(8000, () => {
     console.log('Express server is listening on port 8000!');
});