require('dotenv').config();
const http = require('http');
const app = require('./index')

const server = http.createServer(app);
app.listen(process.env.PORT)