var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const uuid =require('uuid');
let Transaction =require('../models/transaction');




/* GET users listing. */
router.get('/', (req, res) => {
 Transaction.find({},(err,transactions)=>{
      if(err){
        res.status(400).send(err);
      }
      else{
        res.send(transactions);
      }
 });
});






router.post('/',(req,res)=>{
  console.log(req.body);
  let transaction = new Transaction(req.body);
     transaction.time=Date.now()
  transaction.save((err,savedTrans)=>{
    res.status(err?400:200).send(err||savedTrans)
  });
});

router.put('/:id',(req,res)=>{
  console.log('req.body', req.body);
Transaction.findByIdAndUpdate(req.params.id,req.body,{new:true},(err,transaction)=>{
  if(err||!transaction){
    res.status(400).send(err||'transaction not found')
  }
  else{
    res.send(transaction);
  }
});
});


router.delete('/:id',(req,res)=>{
  console.log('delete')
  Transaction.findByIdAndRemove(req.params.id,(err,transaction)=>{
    if(err||!transaction){
      res.status(400).send(err||'transaction not found');
    }
    else{
      res.send(transaction.name+'is now deleted');
    }
  });
});
router.get('/total',(req,res)=>{
  console.log("total route");
  Transaction.aggregate([
    {   $group :{
        _id:null,
        totalcredit:{$sum:'$credit'},
        totaldebit:{$sum:'$debit'}
        

      }
    }],
  
    function(err,results){
      if(err){
        console.log(err);
      }
      else{
       var frontStore ={
          diff :results[0].totalcredit-results[0].totaldebit,
          totalcredit:results[0].totalcredit,
          totaldebit:results[0].totaldebit
        };
       res.send(frontStore);
         
      }
    }
 )});
module.exports = router;
