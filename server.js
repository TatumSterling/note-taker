const express = require('express');
const path = require('path');
const PORT = 3001;
const app = express();
const uuid = require('./uuid');
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// html route
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'notes.html'))
);

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'index.html'))
);
// api route
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for notes`);
  // fs.readFile('./db/db.json', (data) => res.json(JSON.parse(data)));
  const db = JSON.parse(fs.readFileSync('./db/db.json'));
  res.json(db);

});

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);
  const { title, text } = req.body;
  const db = JSON.parse(fs.readFileSync('./db/db.json'));
  console.log(db);
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuid()
    };
    db.push(newNote)
    const newNoteString = JSON.stringify(db)
    fs.writeFileSync('./db/db.json', newNoteString)

    res.json(db);
  } else {
    res.status(400).send('Invalid input. Both title and text are required.');
  }
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  console.log(noteId);
  const db = JSON.parse(fs.readFileSync('./db/db.json'))
  for (let i = 0; i < db.length; i++) {
    if (noteId === db[i].id) {
      db.splice(i, 1);

      fs.writeFileSync('./db/db.json', JSON.stringify(db))
    }

  }
  res.json(db);
}
)

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);