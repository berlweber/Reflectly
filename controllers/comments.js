const express = require('express'); 
const router = express.Router(); 
const Commment = require('../models/comment'); 

// create a new comment
// method is POST
// Path: /:diaryEntryId/comments


router.post('/:diaryEntryId/comments', verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id; 
        const comment = new Comment ({
            comments: req.body.comments,
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

// GET all comments for an entry 
// Path is /:diaryEntryId/comments

router.get('/:diaryEntryId/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ diaryEntry: req.params.diaryEntryId })
        .populate('owner', 'username')
        .sort({ createdAt: -1 }); 

        res.status(200).json(comments); 
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

// delete a comment 
// DELETE 
// path is diaryEntry/:diaryEntryId/comments/:commentId

router.delete('/:diaryId/comments/:commentId', verifyToken, async (req, res) => {
    try { 
        const comment = await Comment.findbyId(req.params.commentId); 

        if (!comment) {
            return res.status(404).json({ message: 'comment nout found '}); 
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