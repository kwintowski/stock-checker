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

module.exports = function (app) {

  
  app.route('/api/stock-prices')
    .get(function (req, res){
      var stock = req.query.stock;
      
      var stockHandler = new StockHandler(app);
      stockHandler.getStock(stock)
      .then(function(result) {return {"stockData":{"stock":stock,"price":result.toString()}};})
      .then()
      .catch((reject)=>{res.json(reject)});
      //res.json("Hi");
    });
    
};
