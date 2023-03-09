const express = require('express');
const path = require('path');
const fs = require('fs');
const {v4} = require('uuid');
let db = require('./db/db.json');


const app = express();
const PORT = 3001;

app.use(express.static('public'));

// Set up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// A get request that will return the content of the notes.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

// A get request that will return the content of the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// API route to get notes from db.json file
app.get('/api/notes', (req, res) => {
    console.info(`GET /api/notes`);
    res.status(200).json(db);
});

// API route to post notes to db.json file
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    const { title, text, id } = req.body;
    if (title && text) {
        // Variable for the new note object to be saved
        const newNote = {
          title,
          text,
          id: v4(),
        };
        
        db.push(newNote);

        fs.writeFile('./db/db.json', JSON.stringify(db), (err) => {
            if (err) {
                console.log(err);
            }
        });

        const response = {
          status: 'success',
          body: newNote,
        };

        res.status(201).json(response);

    } else {
        res.status(500).json('Error in posting note');
    }
});





app.listen(PORT, () =>
    console.log(`Notes app listening at http://localhost:${PORT}`)
);