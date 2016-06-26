'use strict';

var async = require('async');

var mongoose = require('lib/mongoose');
mongoose.set('debug', true);

async.series([
    openConnection,
    dropDatabase,
    initModels,
    createUsers
], function(err) {
    closeConnection(function(err) { if (err) throw err; });

    if (err) throw err;
});

function openConnection(callback) {
    console.log("openConnection...");

    mongoose.connection.on('open', callback);
}

function dropDatabase(callback) {
    console.log("dropDatabase...");

    mongoose.connection.db.dropDatabase(callback);
}

function initModels(callback) {
    console.log("initModels...");

    require('models/user');

    async.each(
        Object.keys(mongoose.models),
        function(modelName, callback) {
            console.log("ensureIndexes for model " + modelName);
            mongoose.models[modelName].ensureIndexes(callback);
        },
        callback
    );
}

function createUsers(callback) {
    console.log("createUsers...");

    async.each([
            {username: "test1", password: "secret"},
            {username: "test2", password: "secret"},
            {username: "test3", password: "secret"}
        ],
        function (userData, callback) {
            console.log("createUser with username " + userData.username);

            var user = new mongoose.models.User(userData);
            user.save(function(err) { callback(err, user); })
        },
        callback
    )
}

function closeConnection(callback) {
    console.log("closeConnection...");
    mongoose.disconnect(callback);
}
