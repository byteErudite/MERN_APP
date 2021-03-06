if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}

const express = require("express")
const expressEjsLayouts = require("express-ejs-layouts")
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')



const indexRouter  = require('./routes/index')
const authorRouter  = require('./routes/authors')
const bookRouter  = require('./routes/books')

// Mongo db connection
const mongoose = require("mongoose");
const multer = require('multer');
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("The connection to the database was successful"))

// Setting view engine as ejs
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}))

// Setting routers to use in app with their repective paths
app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)

app.listen(process.env.PORT || 3000)
