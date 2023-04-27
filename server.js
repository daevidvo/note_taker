const exp = require('express');
const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid');

const app = exp();
const PORT = process.env.PORT || 3001;


app.use(exp.json()); //must use this to parse body content that's sent to post requests; req.body will be undefined without this.
app.use(exp.static('./public')); //makes everything in the public folder static.

app.get('/', (req,res)=>{ //path that requests the base URL will be presented with index.html
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req,res)=>{//path that requests the base URL plus /notes will be presented with notes.html
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req,res)=>{ //get request for when the saved notes want to be displayed
    fs.readFile('./db/db.json', 'utf-8', (err,data)=>{ //have to do fs.readFile or else it will just send the version of db.json that initially loaded when the server opened
        if (err){
            console.log(err);
        }
        res.send(data);
    });
});

app.post('/api/notes', (req,res)=>{ //post request for when the save notes icon is used
    const {title, text} = req.body;

    if(title && text){ //if both of the title and text are truthy values, then it will create the new object. If they aren't truthy values, then it will throw error
        const newNote = {
            title,
            text,
            id: uniqid('note-'), //id generator for the new notes
        };

        fs.readFile('./db/db.json', 'utf-8', (err, data)=>{
            if(err){
                console.log(err);
            }else{
                let parsedNotesData = JSON.parse(data);

                parsedNotesData.push(newNote);

                fs.writeFile('./db/db.json', JSON.stringify(parsedNotesData, null, 2), (err)=>err?console.log(err):console.log('successfully added new note')); //writes to the db.json file and updates it with the new notes
                res.send('new note creation successful'); //NEEDED RES.SEND TO TELL THE FETCH REQUEST THAT THE FETCH HAS CONCLUDED SO THE .THEN FUNCTIONS CAN WORK
            };
        });
    }else{
        req.status(500).json('An error has occurred'); //tells the user if something went wrong while making the note
    };
});

app.delete('/api/notes/:id', (req,res)=>{ //delete request for the note
    // console.log(req.method) //makes sure the request method is delete
    // console.log(req.params.id) //console logs the id that was used for :id. Use this when parsing through db.json to figure out which note to delete
    
    fs.readFile('./db/db.json', 'utf-8', (err, data)=>{ //reads the information from db.json where data = the stringified data from db.json
        if (err){
            console.log(err);
        }else{
            let parsedNotesData = JSON.parse(data) //takes the stringified data from db.json and turns it back into an object

            for(let x=0;x<parsedNotesData.length;x=x+1){ //for loop that looks through the array in parsedNotesData and finds which element's id matches the one of the note's id that was requested to be deleted then deletes said note.
                if (req.params.id === parsedNotesData[x].id){
                    parsedNotesData.splice(x, 1);
                };
            };

            fs.writeFile('./db/db.json', JSON.stringify(parsedNotesData, null, 2), (err)=>err?console.log(err):console.log('note successfully deleted')) //updates the db.json file to represent the newly deleted data.
            res.send('note deletion successful') //NEEDED RES.SEND TO TELL THE FETCH REQUEST THAT THE FETCH HAS CONCLUDED SO THE .THEN FUNCTIONS CAN WORK
        };
    });
});

app.listen(PORT, ()=>{ //initiates server.js on the specified port
    console.log(`Sever is open at http://localhost:${PORT}`);
});