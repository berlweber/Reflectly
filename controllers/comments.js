const express = require('express'); 
const router = express.Router(); 
const Comment = require('../models/comment'); 
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verify-token')

// create a new comment
// method is POST
// Path: /:diaryEntryId/comments


router.post('/:diaryEntryId/comments', verifyToken, async (req, res) => {
    try {
        req.body.owner = req.user._id; 
        const comment = new Comment ({
            comment: req.body.comment,
            diaryEntry: req.params.diaryEntryId, 
            owner: req.user._id
        }); 

        const savedComment = await comment.save(); 
        await savedComment.populate('owner', 'username'); 
        res.status(201).json(savedComment); 
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
});


// update a comment
// PUT
// path is /:diaryEntryId/comments/:commentId

router.put('/:diaryEntryId/comments/:commentId', verifyToken, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId); 

        if (!comment.owner.equals(req.user._id)) {
            return res.status(403).json({ error: 'You do not have authorisation' }); 
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            req.params.commentId, 
            req.body, 
            { new: true }
        ); 

        updatedComment._doc.author = req.user; 

        res.status(200).json(updatedComment); 
    } catch (err) {
        res.status(500).json({ err: err.message }); 
    }
})

// delete a comment 
// DELETE 
// path is /:diaryEntryId/comments/:commentId

router.delete('/:diaryEntryId/comments/:commentId', verifyToken, async (req, res) => {
    try { 
        const comment = await Comment.findById(req.params.commentId); 

        if (!comment) {
            return res.status(404).json({ message: 'comment not found '}); 
        }

        if (comment.owner.toString() !== req.user._id) {
            return res
            .status(403)
            .json({ message: 'You are not authorised to edit this comment '})
        }

        await comment.deleteOne(); 
        res.status(200).json({ message: 'comment deleted successfully' }); 

    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

module.exports = router; 
