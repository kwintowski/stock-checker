'use strict';

var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var request = require('request');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const STOCKS = "stocks";

function StockHandler(app) {
  
  this.getStock = function(stockTicker) {
    
    console.log(stockTicker);
    var uri = 'https://api.iextrading.com/1.0/stock/'+stockTicker+'/price';
    
    return new Promise(function(resolve, reject){  
      request(uri,{json:true},(err,res,data)=> {
        if (err) { reject(err); }
        resolve(data);
        });
      })
    }
  }

  
module.exports = StockHandler;
