'use strict';

var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var request = require('request');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const STOCKS = "stocks";

function StockHandler(app) {
  
  this.getStock = function(stockTicker,likes) {
    
    console.log("GotHere2");
    console.log(stockTicker);
    var uri = 'https://api.iextrading.com/1.0/stock/'+stockTicker+'/price';
    
    return new Promise(function(resolve, reject){  
      request(uri,{json:true},(err,res,data)=> {
        if (err) { reject(err); }
        resolve({"stockData":{"stock":stockTicker,"price":data.toString(),"likes":likes}});;
        });
      })
    }
  
  this.addLike = function(stockTicker, ip, db) {
  
    console.log("GotHere1");

      return new Promise(function(resolve, reject){  
        db.collection(STOCKS).findOneAndUpdate(
          {stock: stockTicker},
          {$addToSet:{likedBy:ip}},
          {upsert:true,returnOriginal:false},((err, doc) => {
          if(err) reject(err);
          console.log(doc.value);
          //resolve(doc.value.likedBy.length);
          resolve(doc.value.likedBy.length);
        }));
      });
    }
  }

  

  
module.exports = StockHandler;
