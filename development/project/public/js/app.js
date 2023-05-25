const express = require('express');
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended : true});

const DBPATH = 'data/project.db'

const app = express();
const hostname = "127.0.0.1";
const port = 3000;

app.use(express.static("public"))
app.set('view engine','ejs');



app.get("/", (req, res) =>{
    res.render("../views/partials/logo.ejs")
});


function check(sql){
    console.log(sql);
};


// Pesquisa os curriculos
app.get('/search', async (req, res)=>{
    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Orgin", "*");
    let search = (req.query.search);
    let db = new sqlite3.Database(DBPATH);
    let sql = `SELECT * FROM ${search} ;`
    check(sql);

    db.all(sql, [], (err, rows)=>{
        if(err){
            check(err.message);
            throw err;
        }
        res.json(rows);
    });
    db.close();

});



app.listen (port, hostname, ()=>{
    console.log(`O servidor está rodando no endereço http://${hostname}:${port}/`);
});
