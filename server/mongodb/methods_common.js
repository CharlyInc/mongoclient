/**
 * Created by RSercan on 5.3.2016.
 */
Meteor.methods({
    'listCollectionNames': function (connectionId, dbName) {
        var connection = Connections.findOne({_id: connectionId});
        var connectionUrl = getConnectionUrl(connection);
        var connectionOptions = getConnectionOptions(connection);
        var mongodbApi = Meteor.npmRequire('mongodb').MongoClient;

        LOGGER.info('[listCollectionNames]', dbName, connectionUrl, clearConnectionOptionsForLog(connectionOptions));

        return Async.runSync(function (done) {
            mongodbApi.connect(connectionUrl, connectionOptions, function (mainError, db) {
                if (mainError) {
                    done(mainError, null);
                    if (db) {
                        db.close();
                    }
                    return;
                }
                try {
                    var wishedDB = db.db(dbName);
                    wishedDB.listCollections().toArray(function (err, collections) {
                        db.close();
                        done(err, collections);
                    });

                }
                catch (ex) {
                    LOGGER.error('[dropCollection]', ex);
                    done(new Meteor.Error(ex.message), null);
                    if (db) {
                        db.close();
                    }
                }
            });
        });

    },

    'getDatabases': function (connectionId) {
        var connection = Connections.findOne({_id: connectionId});
        var connectionUrl = getConnectionUrl(connection);
        var connectionOptions = getConnectionOptions(connection);

        LOGGER.info('[getDatabases]', connectionUrl, clearConnectionOptionsForLog(connectionOptions));

        var mongodbApi = Meteor.npmRequire('mongodb').MongoClient;
        return Async.runSync(function (done) {
            mongodbApi.connect(connectionUrl, connectionOptions, function (mainError, db) {
                if (mainError || db == null || db == undefined) {
                    done(mainError, db);
                    if (db) {
                        db.close();
                    }
                    return;
                }
                try {
                    db.admin().listDatabases(function (err, dbs) {
                        db.close();
                        done(err, dbs.databases);
                    });
                }
                catch (ex) {
                    LOGGER.error('[getDatabases]', ex);
                    done(new Meteor.Error(ex.message), null);
                    if (db) {
                        db.close();
                    }
                }
            });
        });

    },

    'connect': function (connectionId) {
        var connection = Connections.findOne({_id: connectionId});
        var connectionUrl = getConnectionUrl(connection);
        var connectionOptions = getConnectionOptions(connection);

        LOGGER.info('[connect]', connectionUrl, clearConnectionOptionsForLog(connectionOptions));

        var mongodbApi = Meteor.npmRequire('mongodb').MongoClient;
        return Async.runSync(function (done) {
            mongodbApi.connect(connectionUrl, connectionOptions, function (mainError, db) {
                if (mainError || db == null || db == undefined) {
                    done(mainError, db);
                    if (db) {
                        db.close();
                    }
                    return;
                }
                try {
                    db.listCollections().toArray(function (err, collections) {
                        db.close();
                        done(err, collections);
                    });
                }
                catch (ex) {
                    LOGGER.error('[connect]', ex);
                    done(new Meteor.Error(ex.message), null);
                    if (db) {
                        db.close();
                    }
                }
            });
        });
    },

    'dropDB': function (connectionId) {
        var connection = Connections.findOne({_id: connectionId});
        var connectionUrl = getConnectionUrl(connection);
        var connectionOptions = getConnectionOptions(connection);
        var mongodbApi = Meteor.npmRequire('mongodb').MongoClient;

        LOGGER.info('[dropDatabase]', connectionUrl, clearConnectionOptionsForLog(connectionOptions));

        return Async.runSync(function (done) {
            mongodbApi.connect(connectionUrl, connectionOptions, function (mainError, db) {
                if (mainError) {
                    done(mainError, null);
                    if (db) {
                        db.close();
                    }
                    return;
                }
                try {
                    db.dropDatabase(function (err, result) {
                        db.close();
                        done(err, result);
                    });
                }
                catch (ex) {
                    LOGGER.error('[dropDatabase]', ex);
                    done(new Meteor.Error(ex.message), null);
                    if (db) {
                        db.close();
                    }
                }
            });
        });
    },

    'dropCollection': function (connectionId, collectionName) {
        var connection = Connections.findOne({_id: connectionId});
        var connectionUrl = getConnectionUrl(connection);
        var connectionOptions = getConnectionOptions(connection);
        var mongodbApi = Meteor.npmRequire('mongodb').MongoClient;

        LOGGER.info('[dropCollection]', connectionUrl, clearConnectionOptionsForLog(connectionOptions), collectionName);

        return Async.runSync(function (done) {
            mongodbApi.connect(connectionUrl, connectionOptions, function (mainError, db) {
                if (mainError) {
                    done(mainError, null);
                    if (db) {
                        db.close();
                    }
                    return;
                }
                try {
                    var collection = db.collection(collectionName);
                    collection.drop(function (dropError) {
                        done(dropError, null);
                        if (db) {
                            db.close();
                        }
                    });
                }
                catch (ex) {
                    LOGGER.error('[dropCollection]', ex);
                    done(new Meteor.Error(ex.message), null);
                    if (db) {
                        db.close();
                    }
                }
            });
        });
    },

    'dropAllCollections': function (connectionId) {
        var connection = Connections.findOne({_id: connectionId});
        var connectionUrl = getConnectionUrl(connection);
        var connectionOptions = getConnectionOptions(connection);
        var mongodbApi = Meteor.npmRequire('mongodb').MongoClient;

        LOGGER.info('[dropAllCollections]', connectionUrl, clearConnectionOptionsForLog(connectionOptions));

        return Async.runSync(function (done) {
            mongodbApi.connect(connectionUrl, connectionOptions, function (mainError, db) {
                if (mainError) {
                    done(mainError, null);
                    if (db) {
                        db.close();
                    }
                    return;
                }
                try {
                    db.collections(function (err, collections) {
                        collections.forEach(function (collection) {
                            if (!collection.collectionName.startsWith('system')) {
                                collection.drop(function (dropError) {
                                });
                            }
                        });

                        // TODO drop takes some time it should be synced
                        //if (db) {
                        //    db.close();
                        //}
                        done(err, {});
                    });
                }
                catch (ex) {
                    LOGGER.error('[dropAllCollections]', ex);
                    done(new Meteor.Error(ex.message), null);
                    if (db) {
                        db.close();
                    }
                }
            });
        });
    },

    'createCollection': function (connectionId, collectionName, options) {
        var connection = Connections.findOne({_id: connectionId});
        var connectionUrl = getConnectionUrl(connection);
        var connectionOptions = getConnectionOptions(connection);
        var mongodbApi = Meteor.npmRequire('mongodb').MongoClient;

        LOGGER.info('[createCollection]', connectionUrl, clearConnectionOptionsForLog(connectionOptions), collectionName, options);
        return Async.runSync(function (done) {
            mongodbApi.connect(connectionUrl, connectionOptions, function (mainError, db) {
                if (mainError) {
                    done(mainError, null);
                    if (db) {
                        db.close();
                    }
                    return;
                }
                try {
                    db.createCollection(collectionName, options, function (err, result) {
                        done(err, result);
                        if (db) {
                            db.close();
                        }
                    });
                }
                catch (ex) {
                    LOGGER.error('[createCollection]', ex);
                    done(new Meteor.Error(ex.message), null);
                    if (db) {
                        db.close();
                    }
                }
            });
        });
    }
});