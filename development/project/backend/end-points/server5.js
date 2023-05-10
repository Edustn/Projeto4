const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const DBPATH = "data/project.db"

const port = 3010;
const hostename = "127.0.0.1";
const app = express();


app.use(express.json())


function criarTabela(tb_name,tb_colums){
    let db = new sqlite3.Database(DBPATH);
    let sql = (`CREATE TABLE IF NOT EXISTS ${tb_name} (${tb_colums});`);
    db.run(sql, [], (err)=>{
        if(err){
            console.log(err.message);
            throw err;
        }
    });
    db.close();
}


app.get("/criarTabela", (req, res) =>{
    res.statusCode = 200;
    criarTabela(req.params.nome_tb, req.params.colums_tb);
    console.log(req.params.colums_tb +"\n\n"+req.params.nome_tb);
});


app.get("/selecionarTbVariavel",(req, res)=>{
    res.statusCode = 200;
    let db = new sqlite3.Database(DBPATH);
    let nome = req.params.tb_nome;
    let sql = (`SELECT * FROM TB_VARIAVEL}`);
    console.log(nome);

    db.all(sql, [], (err,rows)=>{
        if(err){
            throw err;
        }
        res.json(rows);
    })
    db.close();
});




app.post("/mudarVariavel", (req, res)=>{
    res.statusCode = 200;
    res.setHeader("Access-Controll_Allow-Origin","*");
    let db = new sqlite3.Database(DBPATH);
    let sql = ("UPDATE TB_VARIAVEL SET '"+req.body.campos+"'='"+req.body.value+"', WHERE ID='"+req.body.id+"';");
    db.run(sql, [], err=>{
        if(err){
            console.log(err.message);
            throw err;
        }
    });
    db.close();
});

app.listen(port,hostename,()=>{
    console.log(`O servidor está rodando no link http://${hostename}:${port}/`);
});