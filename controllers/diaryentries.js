const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/`??????`') // <--- Whats the route
const DiaryEntry = require('../models/diary.js')

//CREATE

router.post('/', verifyToken, async (req, res) => {
    try {
    const diaryEntry = await DiaryEntry.create(req.body)
    res.status(201).json(diaryEntry)
 } catch (error) {  
    res.status(500).json(error)
 }
})

//SHOW INDIVIDUAL

router.get('/:diaryEntryId', verifyToken, async (req, res) => {
    try {
        const diaryEntry = await DiaryEntry.findById(req.params.diaryEntryId)
        const comments = await Comment.find({ diaryEntry: req.params.diaryEntryId})
        if (!private || diaryEntry.author.equals(req.user._id)) {
            return res.status(200).json(diaryEntry)
        } else {
            return res.status(403).send('You are not authorized')
        }
    } catch (error) {
        res.status(500).json(error)
    }
})

router.get('/', async (req, res) => {
    try {
        const diaryEntries = await DiaryEntry.find({})

        const filteredEntries = diaryEntries.filter((diaryEntry) => {
            if (diaryEntry.private) {
                return req.user && diaryEntry.owner.toString() === req.user._id.toString(); 
            }
            return true; 
    }); 

        res.status(200).json(filteredEntries); 

    } catch (err) {
        res.status(500).json({ message: err.message }); 
    }
});

router.put('/diaryEntry/:id', verifyToken, async (req, res) => {
    try {
        const diaryEntry = await DiaryEntry.findById(req.params.id); 
        if (!diaryEntry) {
            return res.status(404).json({ message: 'Entry not found'})
        }

        if (diaryEntry.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You do not have authorisation to update this'})
        }

        const updatedDiaryEntry = await DiaryEntry.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        ); 

        updatedDiaryEntry._doc.author = req.user; 

        res.status(200).json(updatedDiaryEntry); 

    } catch (err) {
        res.status(500).json({ err: err.message }); 

    }
});

module.exports = router