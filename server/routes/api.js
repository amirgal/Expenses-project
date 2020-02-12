const express = require('express')
const router = express.Router()
const moment = require('moment')
const Expense = require('../models/Expense')

router.get('/expenses', function(req,res) {
    Expense.find({}).sort({date:-1}).exec(function(err,expenses){
        res.send(expenses)
    })
})

//Need to add a promise then log the item and price 
router.post('/new',function(req,res) {
    const exp = req.body
    const newExp = new Expense({item:exp.item, amount: exp.amount, group: exp.group, date: exp.date ? moment(exp.date).format('LLLL') : moment().format('LLLL')})
    const expPromise = newExp.save()
    expPromise.then(function(){
        console.log(`spent ${exp.amount} dollars on ${exp.item}`)
    })
    res.end()
})

router.put('/update/:group1/:group2', function(req,res) {
    const {group1, group2} = req.params
    Expense.findOneAndUpdate({group:group1},{group:group2},{new: true}).exec(function(err,result) {
        res.send(`changed ${result.item} group from ${group1} to ${group2}`)
    })
})

router.get('/expenses/:group', function(req,res) {
    const total = req.query.total
    const group = req.params.group
    if(total !== 'true'){
        Expense.find({group}).exec(function(err,expenses) {
            res.send(expenses)
        })
    } else {
        Expense.aggregate([
            {$match: {group}},
            {$group:
                {
                    _id: "$group",
                    totalAmount: {$sum: "$amount"}
                }
            }
        ]).exec(function(err,total) {
            res.send(total)
        })
    }
})

router.get('/expenses', function(req,res) {

})


module.exports = router