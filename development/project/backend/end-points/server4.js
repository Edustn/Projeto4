const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const DBPATH = "data/project.db"

const port = 3010;
const hostename = "127.0.0.1";
const app = express();


app.use(express.json())
app.get("/mudarRequisicao",(req, res)=>{
    res.statusCode = 200;
    let db = new sqlite3.Database(DBPATH);
    let sql = (`SELECT * FROM ${req.params.tb_nome}`);

    db.all(sql,[],(err,rows)=>{
        if(err){
            throw err;
        }
        res.json(rows);
    })
    db.close();
});


app.post("/mudarRequisicao", (req, res)=>{
    res.statusCode = 200;
    let db = new sqlite3.Database(DBPATH);
    let sql = (`UPDATE TB_REQUISICAO SET ID_STATUS=1 WHERE ID_REQUISICAO=3;`);
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