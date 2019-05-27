/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var StockHandler = require('../controllers/stockHandler.js');
var MongoClient = require('mongodb');
const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const STOCKS = "stocks";

module.exports = function (app) {

  
  app.route('/api/stock-prices')
    .get(function (req, res){
    
      var stockDatum = [];
      
      if(typeof(req.query.stock)=="string")
        stockDatum.push(req.query.stock);
      else 
        stockDatum = req.query.stock;
    
      var ip = (req.headers['x-forwarded-for']);// || '').split(',').pop() || 
//           req.connection.remoteAddress || 
//           req.socket.remoteAddress || 
//           req.connection.socket.remoteAddress;

      MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, (err, client) => {
        var db = client.db('myMongoDB');

        if(err) console.log('Database error: ' + err);
        
        var likeTicked = req.query.like ? true : false;
        var stockHandler = new StockHandler(app);
        var stockResult = []; //stores the single or multiple result
        stockDatum.forEach(function(stock) {
          stockHandler.addOrCountLikes(likeTicked,stock,ip.substr(0,ip.indexOf(',')),db)
          .then((likes)=>stockHandler.getStock(stock,likes))
          .then(function(stockData){
              stockResult.push(stockData);
                
              if(stock==stockDatum[stockDatum.length-1]) {//only display result once last result is reached
                if(stockResult.length==1) res.json({"stockData":stockResult[0]});  
                else {
                  let likeDiff = stockResult[0].likes - stockResult[1].likes;
                  delete stockResult[0].likes;
                  delete stockResult[1].likes;
                  
                  stockResult[0].rel_likes = likeDiff;
                  stockResult[1].rel_likes = -likeDiff;
                  res.json({"stockData":stockResult});
                }
//                db.close();
              }
            })
          .catch((reject)=>{res.json(reject)});
          });
      });
  });
    
};
