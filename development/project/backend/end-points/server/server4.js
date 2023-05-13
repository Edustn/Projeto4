const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const port = 3010;
const hostname = "127.0.0.1";

const app = express();
const DBPATH = "data-base/project.db";


app.get("/creatTable", (req,res)=>{
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin","*");
    let db = new sqlite3.Database(DBPATH);
    let table = (`CREATE TABLE IF NOT EXISTS TB_VARIAVEL(ID INTEGER PRIMARY KEY, NOME_TESTE TEXT, IDADE_TESTE NUMERIC);`);
    db.run(table, (err)=>{
        if(err){
            console.log(err.message);
            throw err;
        }
    });
    db.close()
});


app.get("/updateCampos", (req, res)=>{
    res.statusCode = 200;
    //res.setHeader("Access-Control-Allow-Origin", "*");
    let db = new sqlite3.Database(DBPATH);
    let sql = ("SELECT * FROM TB-VARIAVEL")
    db.all(sql, [], (err, row)=>{
        if(err){
            throw err;
        }
        res.json(row);
    });
    db.close();
});


app.post("/updateCampos", (res)=>{
    res.statusCode = 200;
    //res.setHeader("Access-Control-Allow-Origin","*");
    let db = new sqlite3.Database(DBPATH);
    let sql = ("UPDATE TB_VARIAVEL SET IDADE_TESTE=99 WHERE NOME_TESTE='BANANA';");
    db.run(sql, [], (err)=>{
        if(err){
            console.log(err.message);
            throw err;
        }
        db.close();
    });
});


app.listen(port,hostname, ()=>{
    console.log(`Servidor iniciado e rodando na porta http://${hostname}:${port}`);
});