const exp = require('express')
const path = require('path')
const fs = require('fs')
const notesData = require('./db/db.json')


const app = exp();
const PORT = 3001;

app.use(exp.static('./public')) //makes everything in the public folder static.

app.get('/', (req,res)=>{ //path that requests the base URL will be presented with index.html
    res.sendFile(path.join(__dirname, './public/index.html'))
})

app.get('/notes', (req,res)=>{//path that requests the base URL plus /notes will be presented with notes.html
    res.sendFile(path.join(__dirname, './public/notes.html'))
})

app.get('/api/notes', (req,res)=>{
    res.send(notesData)
})

app.get














app.listen(PORT, ()=>{
    console.log(`Sever is open at http://localhost:${PORT}`)
})