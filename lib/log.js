var winston = require('winston');

module.exports = function(root) {
    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: (process.env.NODE_ENV == 'development') ? 'debug' : 'error',
                label: root.filename.split('/').slice(-2).join('/')
            })
        ]
    })
};
