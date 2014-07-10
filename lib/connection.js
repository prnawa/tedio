var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
    userName: 'developer',
    password: 'creat10n',
    server: 'dbtest01.ad.laterooms.com'
};

var establishConnection = function(afterConnect) {
    var deferred = Q.defer();

    var connection = new Connection(config);
    connection.on('connect', function(err) {
        if (err) {
            console.log('issue with db', err);
            deferred.reject(err);
            return;
        }
        console.log('db connected');
        afterConnect(connection).then(deferred.resolve, deferred.reject);
    });

    return deferred.promise;
};

var prepareConnection = function(afterConnect) {
    return establishConnection(afterConnect);
};

var executeSql = function(sql, parameters) {
    var onConnection = function(connection) {
        var deferred = Q.defer();

        var request = new Request(sql, function(err, resultCount, results) {
            connection.close();

            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(results);
            }
        });

        _.map(parameters, function(parameter) {
            request.addParameter(parameter.name, parameter.type, parameter.value);
        });

        connection.execSql(request);

        return deferred.promise;
    };

    return prepareConnection(onConnection);
};

module.exports = {
    executeSql: executeSql
};
