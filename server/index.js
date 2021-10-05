const express = require('express')
const app = express();
var cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const employeeRouter = require("./routes/employees")

const port = parseInt(process.env.PORT, 10) || 4000
// Middleware
app.use(cors())
dotenv.config()
app.use(express.json())


// Start the server and connect with mongodb

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Database Connected!!")
    app.listen(port, () => {
        console.log("Backend is running on port ", port)
    })
}).catch(err => console.log(err))

app.use("/api/employees", employeeRouter)