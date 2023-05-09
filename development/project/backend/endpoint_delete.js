const express = require('express'); 
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const sqlite3 = require('sqlite3').verbose();
const DBPATH = 'data/project.db';

const hostname = '127.0.0.1';
const port = 3000;
const app = express();


app.use(express.json());

function deletar_tabela(nome_tabela,campo, pk){
    sql = `DELETE FROM ${nome_tabela} WHERE ${campo} = '${pk}';`
	console.log(sql);
	var db = new sqlite3.Database(DBPATH); // Abre o banco
	db.run(sql, [], err => {
		if (err) {
		    throw err;
		}
        return true;
	});
	db.close()
    
}

app.post('/removeTabela', urlencodedParser, (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); 
	deletar_tabela(req.body.nome_tabela,req.body.campo_tabela, req.body.id_tabela);
	res.end();
});

app.listen(port, hostname, () => {
	console.log(`Servidor rodando em http://${hostname}:${port}/`);
  });