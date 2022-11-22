const express = require('express');
const connection = require('../connection');
const router = express.Router();

const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { query } = require('express');
require('dotenv').config;

//rota para adicionar novo usuario
router.post('/signup', (req, res) => {
    let user = req.body;
    query = "select email,password,role,status from user where email=?"
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "insert into user(name,contactNumber,email,password,status,role) values(?,?,?,?,'false','user')";
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Registrado com Sucesso!" });
                    }
                    else {
                        return res.status(500).json(err)
                    }
                })
            }
        }
        else {
            res.status(500).json(err);
        }
    })
})

//rota para login
router.post('/login', (req, res) => {
    const user = req.body;
    query = "select email,password,role,status from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({ message: "Usuário ou senha incorreto" });
            }
            else if (results[0].status === 'false') {
                return res.status(401).json({ message: "Aguarde a aprovação do Administrador" });
            }
            else if (results[0].password == user.password) {
                const response = { email: results[0].email, role: results[0].role }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' })
                res.status(200).json({ token: accessToken });
            }
            else {
                return res.status(400).json({ message: "Algo deu errado. Tente novamente mais tarde." })
            }
        }
        else {
            return res.status(500).json(err);
        }
    })
})

//Endpoint para enviar email de recuperação caso usuário tenha esquecido a senha
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

//rota para esqueceu a senha
router.post('/forgotpassword', (req,res) => {
    const user = req.body;
    query = "select email,password from user where email =?";
    connection.query(query,[user.email], (err, results)=>{
        if(!err){
            if( results.length <= 0 ){
                return res.status(200).json({message:"Senha enviada para o seu email com sucesso"});
            }else{
                var mailOptions ={
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: 'Sua senha do Gerenciamento da Clínica',
                    html: '<p><b>Seus detalhes de Login para o Software de Gerenciamento da Clínica</b><br><b>Email: </b>'+results[0].email+'<br><b>Senha: </b>'+results[0].password+'<br><a href= "http://localhost:4200/">Clique aqui para Fazer Login no Sistema</a></p>'
                };
               transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error);
                    }
                    else{
                        console.log("Email enviado: " + info.response);
                    }
                });
                return res.status(200).json({message: "Senha enviada com sucesso para o seu email."});
            }
        }else{
            res.status(500).json(err);
        }
    })
})

//rota para requisitar todos os usuários do DB
router.get('/get', (req, res) =>{
    var query = "select id,name,email,contactNumber,status from user where role ='user'";
    connection.query(query,(err,results)=>{
        if(!err){
             return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})

//alterar dad
router.patch('/update', (req, res) =>{
    let user = req.body;
    var query = "update user set status=? where id=?";
    connection.query(query,[user.status,user.id], (err, results) =>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"ID do usuário não existe"});
            }
            return res.status(200).json({message:"Usuário atualizado com sucesso"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

router.get('/checkToken', (req,res) => {
    res.status(200).json({message:"true"}); 
})

module.exports = router