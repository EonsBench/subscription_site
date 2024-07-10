const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const passport = require('./config/passport')
const userRoute = require('./routes/user');

dotenv.config();

const app = express();
app.use(express.json());
app.use(passport.initialize());

connectDB();

app.use('/api/users', userRoute);

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})