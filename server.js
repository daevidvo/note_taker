const exp = require('express')
const path = require('path')
const fs = require('fs')
const notesData = require('./db/db.json')


const app = exp();
const PORT = 3001;

app.use(exp.json()); //must use this to parse body content that's sent to post requests; req.body will be undefined without this.
app.use(exp.static('./public')) //makes everything in the public folder static.

app.get('/', (req,res)=>{ //path that requests the base URL will be presented with index.html
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.get('/notes', (req,res)=>{//path that requests the base URL plus /notes will be presented with notes.html
    res.sendFile(path.join(__dirname, './public/notes.html'))
})

app.get('/api/notes', (req,res)=>{ //get request for when the saved notes want to be displayed
    res.send(notesData)
})

app.post('/api/notes', (req,res)=>{ //post request for when the save notes icon is used
    console.log(req.method);
    console.log(notesData) //console.logs the note that the person just wrote
    console.log(typeof notesData) //checks to see what data type the notesData is. Should be an object
    console.log(req.body)

    const {title, text} = req.body;

    if(title && text){ //if both of the title and text are truthy values, then it will create the new object. If they aren't truthy values, then it will throw error
        const newNote = {
            title,
            text,
        };

        notesData.push(newNote); //adds the new note to existing db.json object;
        let newNotesData = JSON.stringify(notesData, null, 2) //stringifies the new notesData object with the new note

        fs.writeFile('./db/db.json', newNotesData, (err)=>err?console.log(err):console.log('db.json has been successfully updated')) //writes to the db.json file and updates it with the new notes

    }else{
        req.status(500).json('An error has occurred');
    }
})














app.listen(PORT, ()=>{
    console.log(`Sever is open at http://localhost:${PORT}`)
})