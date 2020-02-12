const express = require('express')
const path = require('path')
var bodyParser = require('body-parser')
const api = require('./server/routes/api')
const app = express()
const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/expenses", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false })

app.use(express.static(path.join(__dirname, 'dist')))
app.use(express.static(path.join(__dirname, 'node_modules')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', api)

// //Run Once to load data
// const expensesData = require('./expenses.json')
// const Expense = require('./server/models/Expense')
// expensesData.forEach(exp => {
//     const e = new Expense(exp)
//     e.save()
// });

const port = 3000
app.listen(port, function () {
    console.log(`Running server on port ${port}`)
})