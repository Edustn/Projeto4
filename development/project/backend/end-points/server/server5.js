//const { urlencoded } = require("body-parser");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const port = 3010;
const hostname = "127.0.0.1";

const app = express();
const DBPATH = ("data-base/project.db");




app.get('/atualizarRequisicao', (req, res) =>{
    res.statusCode = 200;
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    let db =  new sqlite3.Database(DBPATH);
    db.all("SELECT * FROM TB_VARIAVEL", (err, row)=>{
        if (err){
            throw err;
        }
        res.json(row);
    });
    db.close();
});


app.post('/atualizarRequisicao', (req, res)=>{
    res.statusCode = 200;
    //res.setHeader('Access-Control-Allow-Origin', '*');
    let db = new sqlite3.Database(DBPATH);
    db.run(`UPDATE TB_VARIAVEL SET IDADE_TESTE=0 WHERE NOME_TESTE="BANANA"`, (err)=>{
        if (err){
            console.error(err.message);
            res.statusCode = 500;
        }
        res.end();
    });
    db.close();
});


app.listen(port,hostname, ()=>{
    console.log(`O servidor está rodando no endereço http://${hostname}:${port}/`);
});