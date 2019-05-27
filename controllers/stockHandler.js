'use strict';

var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;
var request = require('request');

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const STOCKS = "stocks";

function StockHandler(app) {
  
  this.getStock = function(stockTicker,likes) {
    
    var uri = 'https://api.iextrading.com/1.0/stock/'+stockTicker+'/price';
    
    return new Promise(function(resolve, reject){  
      request(uri,{json:true},(err,res,data)=> {
        if (err) { reject(err); }
        resolve({"stock":stockTicker,"price":data.toString(),"likes":likes});;
        });
      })
    }
  
  this.addOrCountLikes = function(likeTicked, stockTicker, ip, db) {
  
    if(likeTicked) {
      return new Promise(function(resolve, reject){  
        db.collection(STOCKS).findOneAndUpdate(
          {stock: stockTicker},
          {$addToSet:{likedBy:ip}},
          {upsert:true,returnOriginal:false},((err, doc) => {
            if(err) reject(err);
            resolve(doc.value.likedBy.length);
          }));
        });
      }
    else {
      return new Promise(function(resolve, reject){  
      db.collection(STOCKS).findOne(
        {stock: stockTicker},((err, doc) => {
          if(err) reject(err);
          resolve(doc!=null?doc.likedBy.length:0);
        }));
      });
      } 
    }
  
  this.addLike = function(stockTicker, ip, db) {
  
    return new Promise(function(resolve, reject){  
      db.collection(STOCKS).findOneAndUpdate(
        {stock: stockTicker},
        {$addToSet:{likedBy:ip}},
        {upsert:true,returnOriginal:false},((err, doc) => {
          if(err) reject(err);
          resolve(doc.value.likedBy.length);
        }));
      });
    }  
  
    //findOne - get the number of likes if the button hasn't been pressed.
  this.countLikes = function(stockTicker, db) {
  
    return new Promise(function(resolve, reject){  
      db.collection(STOCKS).findOne(
        {stock: stockTicker},((err, doc) => {
          if(err) reject(err);
          resolve(doc!=null?doc.likedBy.length:0);
        }));
      });
    }  
  }

  

  
module.exports = StockHandler;
