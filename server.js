const express = require('express');
const notesDb = require('./db/db.json');
const path = require('path');
const PORT = 3001;
const app = express();
const { readFromFile, readAndAppend } = require('./fsUtils');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for notes`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
    };

    readAndAppend(newNote, './db/db.json').then(() => {
      res.json('Note added successfully');
    }).catch((err) => {
      res.status(500).send('Error in adding note');
    });
  } else {
    res.status(400).send('Invalid input. Both title and text are required.');
  }
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);