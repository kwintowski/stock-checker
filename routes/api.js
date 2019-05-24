/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var StockHandler = require('../controller/stockHandler.js');
var MongoClient = require('mongodb');
const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});
const STOCKS = "stocks";

module.exports = function (app) {

  
  app.route('/api/stock-prices')
    .get(function (req, res){
    
      var stock = req.query.stock;
      var ip = (req.headers['x-forwarded-for']);// || '').split(',').pop() || 
//           req.connection.remoteAddress || 
//           req.socket.remoteAddress || 
//           req.connection.socket.remoteAddress;

      console.log(ip.substr(0,ip.indexOf(',')));
      
      MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true }, (err, client) => {
        var db = client.db('myMongoDB');

        if(err) console.log('Database error: ' + err);
        var stockHandler = new StockHandler(app);
        stockHandler.addLike(stock,ip.substr(0,ip.indexOf(',')),db)
        .then((likes)=>stockHandler.getStock(stock,likes))
        .then((stockData)=>res.json(stockData))
        .catch((reject)=>{res.json(reject)});
      });
  });
    
};
