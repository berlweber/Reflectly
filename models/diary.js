const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const diarySchema = new mongoose.Schema({
    title: {
        type: String,
    },
    owner: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        }, 
    mood: {
        type: String,
        enum: ['happy', 'sad', 'bored', 'afraid', 'excited', 'angry', 'surprised', 'calm'], 
        required: true
    },  
    moodLvl: { 
        type: Number,
        min: [1],
        max: [10],
        required: true
    },
    reflection: {
        type: String
    },
    upVote: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    isEntryPublic: { 
        type: Boolean,
        required: true 
    },
    isEntryUsernamePublic: { 
        type: Boolean, 
        required: true
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: [commentSchema],
},
{ timestamps: true });

const DiaryEntry = mongoose.model('DiaryEntry', diarySchema)

module.exports = DiaryEntry