var winston = require('winston');
var path = require('path');
var ENV = process.env.NODE_ENV;

module.exports = function(root) {
    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: (ENV == 'development') ? 'debug' : 'error',
                label: module.filename.split('/').slice(-2).join('/')
            })
        ]
    })
};