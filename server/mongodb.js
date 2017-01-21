
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

var insert = function(db, incollection, obj, callback) {
  // Get the documents collection
  var collection = db.collection(incollection);
  // Insert some documents
  collection.insertOne(obj, function(err, result) {

    callback(result);
  });
}

var insertDocument = function(db, documents, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertOne(documents, function(err, result) {
    if (err != null) {
      console.log("error?");
      console.log(err);
    }

    callback(result);
  });
}

// queryFilter: {'a': 3}
var find = function(db, incol, queryFilter, callback) {
  // Get the documents collection
  var collection = db.collection(incol);
  // Find some documents
  collection.find(queryFilter).toArray(function(err, docs) {
    if (err != null) {
      console.log("error?");
      console.log(err);
    }

    callback(docs);
  });
}

// queryFilter: {'a': 3}
var findDocument = function(db, queryFilter, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find(queryFilter).toArray(function(err, docs) {
    if (err != null) {
      console.log("error?");
      console.log(err);
    }

    callback(docs);
  });
}

// queryFilter = {'a': 3}
// set = { $set: {'b': 1} }
var update = function(db, incol, queryFilter, set, callback) {
  // Get the documents collection
  var collection = db.collection(incol);
  // Update document where a is 2, set b equal to 1
  collection.updateOne(queryFilter, set, function(err, result) {
    if (err != null) {
      console.log("error?");
      console.log(err);
    }

    callback(result);
  });
}

// queryFilter = {'a': 3}
// set = { $set: {'b': 1} }
var updateDocument = function(db, queryFilter, set, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.updateOne(queryFilter, set, function(err, result) {
    if (err != null) {
      console.log("error?");
      console.log(err);
    }

    callback(result);
  });
}

var remove = function(db, incol, doc, callback) {
  // Get the documents collection
  var collection = db.collection(incol);
  // Insert some documents
  collection.deleteOne(doc, function(err, result) {
    assert.equal(err, null);
    console.log("Removed the document");
    callback(result);
  });
}

var removeDocument = function(db, doc, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.deleteOne(doc, function(err, result) {
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
module.exports.insert = insert;
module.exports.find = find;
module.exports.update = update;
module.exports.remove = remove;
