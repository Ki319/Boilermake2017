
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var insertDocuments = function(db, documents, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany(documents, function(err, result) {
    assert.equal(err, null);
    var len = result.result.n;
    console.log("Inserted " + len + " documents into the collection");
    callback(result);
  });
}

// queryFilter: {'a': 3}
var findDocuments = function(db, queryFilter, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find(queryFilter).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}

var updateDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the document with the field a equal to 2");
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

name = "Mother Jones";
regExp = "motherjones\.com\/.*\/20[0-1][0-9]\/";
addNewsSite(name, regExp);
name = "Huffington Post";
regExp = "huffingtonpost\.com\/entry";
addNewsSite(name, regExp);
name = "Vox";
regExp = "vox\.com\/.*/20[0-1][0-9]/";
addNewsSite(name, regExp);


// Connection URL
var url = 'mongodb://localhost:27017/myproject';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  insertDocuments(db, [{"a" : 4}], function() {
    findDocuments(db, {}, function() {
      updateDocument(db, function() {
        findDocuments(db, {}, function() {
          removeDocument(db, {"a": 4}, function() {
            indexCollection(db, function () {
              findDocuments(db, {}, function() {
                db.close();
              });
            });
          });
        });
      });
    });
  });
});
