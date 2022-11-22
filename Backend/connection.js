//requisição da instação do mysql 2
const mysql2 = require('mysql2');
require('dotenv').config();

//criação da variável de conexão
var connection = mysql2.createConnection({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect((err) => {
    if(!err){
        console.log("Conectado");
    }
    else{
        console.log(err);
    }
});

console.exports = connection;