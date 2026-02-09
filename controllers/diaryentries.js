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
        if (!private || diaryEntry.author.equals(req.user._id)) {
            return res.status(200).json(diaryEntry)
        } else {
            return res.status(403).send('You are not authorized')
        }
    } catch (error) {
        res.status(500).json(error)
    }
})