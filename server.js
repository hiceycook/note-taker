const { notes } = require('./data/db');
const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;

const app = express();
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

//Add front end files to server
app.use(express.static('public'));


//GET NOTES JSON
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

//DISPLAY INDEX.HTML TO SERVER ROOT
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
//DISPLAY NOTES.HTML TO SERVER /NOTES
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})
//SEND INDEX.HTML TO WILDCARD ROUTES
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

//VALIDATE NOTE FORMAT FOR POST 
function validateNote(note) {
    if (!note.title || typeof note.title !== 'string') {
        return false
    }
    if (!note.text || typeof note.text !== 'string') {
        return false;
    }
    return true;
};

// CREATE NEW NOTE ON POST FUNCTION
function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './data/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );
    //return finished code to POST route for response
    return note;
}

//POST New Note
app.post('/api/notes', (req, res) => {
    // req.body is where our incoming content will be

    //set id of created note to whatever the next index of the array is //
    req.body.id = notes.length.toString();
    // if any note data in req.body is incorrect, send a 400 error //
    if (!validateNote(req.body)) {
        res.status(400).send('The note is not properly formatted');
    } else {
        const note = createNewNote(req.body, notes);
        res.json(note);
    }
});

app.delete("/notes/:id", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    const delNote = notes.filter((rmvNote) => rmvNote.id !== req.params.id);
    fs.writeFileSync("./db/db.json", JSON.stringify(delNote));
    res.json(delNote);
    // console.log(delNote);
})




app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

