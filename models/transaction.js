const mongoose =require('mongoose');

let bankSchema = new mongoose.Schema({
  name:{type:String},
  credit:{type:Number},
  debit:{type:Number},
  amount:{type:Number},
  time:{type:Date}
})

let Transaction = mongoose.model('transaction',bankSchema);
module.exports = Transaction;