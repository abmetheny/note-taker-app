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

// Middleware route to get notes from db.json file
app.get('/api/notes', (req, res) => {
    console.info(`GET /api/notes`);
    res.status(200).json(db);
});

// Middleware route to post notes to db.json file
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

// Middleware route to delete notes from db.json file
app.delete('/api/notes/:id', (req, res) => {
    if (req.params.id) {
        console.info(`${req.method} request received to delete a note`);
        // Returns the json db array, filtering out the object with the selected id parameter
        let filtered = db.filter(note => {
            return note.id != req.params.id;
        });
        console.log(filtered);       

        // Overwrites old db.json file with the new filtered json array
        fs.writeFile('./db/db.json', JSON.stringify(filtered), (err) => {
            if (err) {
                console.log(err);
            }
            res.status(201).json(filtered);
        
            // Reads the new db.json file so that the newly filtered list will be displayed on the page
            readFromFile('./db/db.json').then((data) =>
                res.json(JSON.parse(data)));
        });

    }

});

app.listen(process.env.PORT || PORT, () =>
    console.log(`Notes app listening at PORT.`)
);