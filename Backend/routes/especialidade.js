const e = require('express');
const express = require('express');
const connection = require('../connection');
const router = express.Router();

//Adicionar Nova especialidade Médica ao Sistema
router.post('/add', (req, res) => {
    let especialidade = req.body;
    query = "INSERT INTO especialidade name values(?)";
    connection.query(query,[especialidade.name],(err, results)=> {
        if(!err){
            return res.status(200).json({message:"Especialidade criada com sucesso."});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

//Listar todas as Especialidades por ordem de nome
router.get('/get', (req, res, next) => {
    var query = "SELECT * FROM especialidade order by name";
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})

router.patch('/update', (req,res,next) => {
    let especialidade = req.body;
    var query = "update especialidade set name=? where id=?";
    connection.query(query,[especialidade.name, especialidade.id], (err, results) => {
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"ID da Especialidade não encontrado"});
            }
            return res.status(200).json({message:"Especialidade atualizada com sucesso"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})

 module.exports = router;