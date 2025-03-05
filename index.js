const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Resume = require('./models/resume');
const multer = require('multer')
const aiMiddleware=require('./middleware/api')
const extractPdfText=require('./middleware/extractPdfText')

require('dotenv').config();

const MDB_URI = process.env.MDB_URI;

const app = express();
app.use(cors())
const upload = multer();

app.use(express.json())
app.get('/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const resume = await Resume.findOne({ username: name });
        if (resume) res.status(200).json(resume)
        else res.status(404).json({ "msg": "not found!" })
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})
app.get('/user/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const resume = await Resume.findOne({ username: name });
        if (resume) res.status(200).json({"avaiable":"no"})
        else res.json({ "available": "yes" })
    } catch (error) {
        console.log(error)
        res.send(error)
    }
})
app.post('/add', upload.single('pdfFile'),extractPdfText,aiMiddleware, async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const { username } = req.body;
        // const data = await pdfParse(req.file.buffer);
        const newResume=new Resume({
            username:username,
            resumePdfText:req.ai
        })
        console.log("HELO",req.ai)
        console.log(newResume)
        await newResume.save()
        res.json(newResume)

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to extract text' });
    }
})




mongoose.connect(MDB_URI)
    .then(() => {
        app.listen(3000, () => {
            console.log("listening on http://localhost:3000")
        })
    })
    .catch(e => console.log(e))