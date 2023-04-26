const exp = require('express')
const path = require('path')
const fs = require('fs')
const uniqid = require('uniqid')
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
    console.log(req.body)

    const {title, text} = req.body;

    if(title && text){ //if both of the title and text are truthy values, then it will create the new object. If they aren't truthy values, then it will throw error
        const newNote = {
            title,
            text,
            id: uniqid('note-'), //id generator for the new notes
        };

        notesData.push(newNote); //adds the new note to existing db.json object;
        let newNotesData = JSON.stringify(notesData, null, 2) //stringifies the new notesData object with the new note

        fs.writeFile('./db/db.json', newNotesData, (err)=>err?console.log(err):console.log('db.json has been successfully updated')) //writes to the db.json file and updates it with the new notes

    }else{
        req.status(500).json('An error has occurred'); //tells the user if something went wrong while making the note
    }
});

app.delete('/api/notes/:id', (req,res)=>{ //delete request for the note
    console.log(req.method) //makes sure the request method is delete
    console.log(req.params.id) //console logs the id that was used for :id. Use this when parsing through db.json to figure out which note to delete
    
    fs.readFile('./db/db.json', 'utf-8', (err, data)=>{ //reads the information from db.json where data = the stringified data from db.json
        if (err){
            console.log(err);
        }else{
            let parsedNotesData = JSON.parse(data) //takes the stringified data from db.json and turns it back into an object

            console.log(parsedNotesData) //verifies the existence of parsedNotesData

            for(let x=0;x<parsedNotesData.length;x=x+1){ //for loop that looks through the array in parsedNotesData and finds which element's id matches the one of the note's id that was requested to be deleted then deletes said note.
                if (req.params.id === parsedNotesData[x].id){
                    parsedNotesData.splice(x, 1)
                    console.log(parsedNotesData)
                }
            }

            fs.writeFile('./db/db.json', JSON.stringify(parsedNotesData, null, 2), (err)=>err?console.log(err):console.log('note successfully deleted')) //updates the db.json file to represent the newly deleted data.
            //for some reason the function to render the notes isn't working so that's weird :////////
        }
    })
})














app.listen(PORT, ()=>{
    console.log(`Sever is open at http://localhost:${PORT}`)
})