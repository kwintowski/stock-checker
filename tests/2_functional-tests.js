/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .set('x-forwarded-for', '1.2.3.4')
        .query({stock: 'goog'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body.stockData, 'stock', 'stockdata has property "stock"');
          assert.property(res.body.stockData, 'price', 'stockdata has property "price"');
          assert.property(res.body.stockData, 'likes', 'stockdata has property "likes"');          
          done();
        });
      });
      
      test('1 stock with like', function(done) {
       chai.request(server)
        .get('/api/stock-prices?stock=aapl&like=true')
        .set('x-forwarded-for', '1.2.3.4')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body.stockData, 'stock', 'stockdata has property "stock"');
          assert.property(res.body.stockData, 'price', 'stockdata has property "price"');
          assert.property(res.body.stockData, 'likes', 'stockdata has property "likes"'); 
          assert.nestedPropertyVal(res.body,'stockData.likes',2);
          done();
        });        
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .set('x-forwarded-for', '1.2.3.4')
        .query({stock: 'aapl'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an object');
          assert.property(res.body.stockData, 'stock', 'stockdata has property "stock"');
          assert.property(res.body.stockData, 'price', 'stockdata has property "price"');
          assert.property(res.body.stockData, 'likes', 'stockdata has property "likes"'); 
          assert.nestedPropertyVal(res.body,'stockData.likes',2);
          done();
        });        
      });
      
      test('2 stocks', function(done) {
       chai.request(server)
        .get('/api/stock-prices?stock=goog&stock=msft')
        .set('x-forwarded-for', '1.2.3.4')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData, 'StockData object should hold an array');
          assert.property(res.body.stockData[0], 'stock', 'stockdata has property "stock"');
          assert.property(res.body.stockData[0], 'price', 'stockdata has property "price"');
          assert.property(res.body.stockData[0], 'rel_likes', 'stockdata has property "likes"'); 
          assert.property(res.body.stockData[1], 'stock', 'stockdata has property "stock"');
          assert.property(res.body.stockData[1], 'price', 'stockdata has property "price"');
          assert.property(res.body.stockData[1], 'rel_likes', 'stockdata has property "likes"');         
          done();
        });        
      });
      
      test('2 stocks with like', function(done) {
       chai.request(server)
        .get('/api/stock-prices?stock=msft&stock=intc&like=true')
        .set('x-forwarded-for', '1.2.3.4')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body.stockData, 'StockData object should hold an array');
          assert.property(res.body.stockData[0], 'stock', 'stockdata has property "stock"');
          assert.property(res.body.stockData[0], 'price', 'stockdata has property "price"');
          assert.property(res.body.stockData[0], 'rel_likes', 'stockdata has property "likes"'); 
          assert.property(res.body.stockData[1], 'stock', 'stockdata has property "stock"');
          assert.property(res.body.stockData[1], 'price', 'stockdata has property "price"');
          assert.property(res.body.stockData[1], 'rel_likes', 'stockdata has property "likes"');   
          assert.nestedPropertyVal(res.body,'stockData[0].rel_likes',2);        
          assert.nestedPropertyVal(res.body,'stockData[1].rel_likes',-2);
          done();
        });         
      });
      
    });

});
