var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');


// var url = 'mongodb://localhost:27017/student';
var url = 'mongodb://anshul:prework@ds013232.mlab.com:13232/classroom'

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  // console.log("Connected correctly to server");


  // insertDocuments(db, function() {
    findDocuments(db, function() {
      db.close();
      // console.log(data)
    });
  // });

});

// var insertDocuments = function(db, callback) {
//   // Get the documents collection
//   var collection = db.collection('documents');
//   // Insert some documents
//   collection.insertMany([
//     {a : 1}, {a : 2}, {a : 3}
//   ], function(err, result) {
//     assert.equal(err, null);
//     assert.equal(3, result.result.n);
//     assert.equal(3, result.ops.length);
//     console.log("Inserted 3 documents into the collection");
//     callback(result);
//   });
// }

var data = {}

var findDocuments = function(db, callback) {
  var collection = db.collection('studentData');
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    // console.log("Found the following records");
    console.log(JSON.stringify(docs, null, 2))
    var studentData = docs;
    data = studentData
    // console.log(studentData)
    callback(docs);
  });;
}
