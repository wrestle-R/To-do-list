const express = require("express")
const dotenv = require("dotenv").config()
const cors = require('cors')
const {mongoose} = require('mongoose')
const app = express()
const cookieParser = require('cookie-parser')
const movieRoutes = require('./routes/movieRoutes'); // Assuming movieRoutes.js is in the 'routes' folder
const studyRoutes = require('./routes/studyRoutes')
const taskRoutes = require('./routes/taskRoutes')


// db
mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log('Database Connected'))
.catch((err) => console.log('Database not connected',err))

// middleware 
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))

app.use('/', require('./routes/authRoutes'))
app.use('/api', movieRoutes);
app.use('/api', studyRoutes);
app.use('/api', taskRoutes);




const port = 8000
app.listen(port, () => console.log(`Server is running on port ${port}`))