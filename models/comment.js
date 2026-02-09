const mongoose = require('mongoose'); 

const commentSchema = new mongoose.Schema({
    comment: {
        type: String, 
        required: true
    }, 
    upVote: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
    }], 
    diaryEntry: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'DiaryEntry', 
        required: true
    }, 
    owner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, 
}, 
{
     timestamps: true 
}); 

const Comment = mongoose.model('Comments', commentsSchema); 

module.exports = Comment; 