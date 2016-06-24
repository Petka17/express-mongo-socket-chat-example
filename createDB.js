var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/chat", function(err, db) {
    if (err) throw err;

    var collection = db.collection('test_insert');

    collection.removeMany({}, function(err, affected) {
        if (err) throw err;

        collection.insertOne({a: 2}, function(err, docs) {
            if (err) throw err;

            collection.find().toArray(function(err, results) {
                if (err) throw err;

                console.dir(results);

                db.close();
            });
        });
    });
});
