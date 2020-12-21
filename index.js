const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8080;

const corsProxy = require('cors-anywhere');
corsProxy.createServer({
    originWhitelist: ["https://fantasy.premierleague.com"],
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});