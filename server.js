const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

// Routes
const authRouter = require('./controllers/auth');
const diaryEntriesRouter = require ('./controllers/diaryentries')

const port = process.env.port ? process.env.port : 3000;

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongDB ${mongoose.connection.name}.`);
});

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// routes here
app.use('/auth', authRouter);
app.use('/diaryEntry', diaryEntriesRouter)

app.get('/', (req, res) => {
    res.send('this does work!');
})

app.listen(port, () => {
    console.log(`The express app is ready on port: ${port}`);
});
