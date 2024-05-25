const serialize = require('node-serialize');
const crypto = require('crypto');
const { sendToLogger } = require('./utils/sendToLogger') 
const cookieName = 'visitorInfo'

module.exports.setCookie = (req, res, next) => {
    const visitorInfo = req.cookies.visitorInfo;
    
    if(!visitorInfo){
        const visitorInfo = {
            'browserId': crypto.randomBytes(20).toString('base64'),
            'ipAddress': req.socket.remoteAddress,
            'userAgent': req.get('user-agent'),
            'currentURL': req.protocol + '://' + req.get('host') + req.originalUrl
        }
        const encodedCookie = new Buffer.from(JSON.stringify(visitorInfo), 'utf-8').toString('base64');

        res.cookie(cookieName, encodedCookie);
    }
    next()
}

module.exports.parseCookie = (req, res, next) => {
    
    try {
        const visitorInfo = req.cookies.visitorInfo;

		if (visitorInfo && visitorInfo !== undefined) {
            const visitorInfoString = new Buffer.from(req.cookies.visitorInfo, 'base64').toString();
			const visitorInfoObject = serialize.unserialize(visitorInfoString);
            let currentURL = req.protocol + '://' + req.get('host') + req.originalUrl;

            visitorInfoObject.currentURL = currentURL;
            sendToLogger(visitorInfoObject);

		}

        next();
	}
	catch(error){
		console.log(error);
	}
}