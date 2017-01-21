
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var insertDocument = function(db, document, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertOne(document, function(err, result) {

    callback(result);
  });
}

// queryFilter: {'a': 3}
var findDocument = function(db, queryFilter, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find(queryFilter).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records: " + docs);
    callback(docs);
  });
}

// queryFilter = {'a': 3}
// set = { $set: {'b': 1} }
var updateDocument = function(db, queryFilter, set, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.updateOne(queryFilter, set, function(err, result) {
    callback(result);
  });
}

var removeDocument = function(db, doc, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.deleteOne(doc, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document");
    callback(result);
  });
}

var indexCollection = function(db, callback) {
  db.collection('documents').createIndex(
    { "a": 1 },
      null,
      function(err, results) {
        console.log(results);
        callback();
    }
  );
};

module.exports.MongoClient = MongoClient;
module.exports.insertDocument = insertDocument;
module.exports.findDocument = findDocument;
module.exports.updateDocument = updateDocument;
module.exports.removeDocument = removeDocument;
