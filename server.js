const dotenv = require('dotenv');
//! dotenv should be called right after requiring it. So that all the modules or function can get the environment variables.
dotenv.config();
const mongoose = require('mongoose');
const app = require('./app');

const DB_URI = process.env.MONGODB_SERVER.replace('<password>', process.env.DB_ATLAS_PASSWORD);

//! Connect MongoDB
mongoose.connect(DB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('MongoDB Connection Failed'));

//! Run Server
const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Listing on port ${port}`);
})