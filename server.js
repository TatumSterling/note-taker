const express = require('express');
const notesDb = require('./db/db.json');
const path = require('path');
const PORT = 3001;
const app = express ();

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static('public'));

