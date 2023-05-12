const express = require('express');  
const DBManager = require('./classes/DBManager.js');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const sqlite3 = require('sqlite3').verbose();
const DBPATH = 'data/test.db';
const DBM = new DBManager(DBPATH)

const hostname = '127.0.0.1';
const port = 3000;
const app = express();


app.use(express.json());
/**
 * 1. SELECT * FROM tb_tabela LIMIT 1, limite_recebido
2. SELECT * FROM tb_tabela WHERE id_tabela = id_recebido_tabela
3. INSERT INTO tb_report(dados_databela) VALUES (dados_recebidos)
ADM
4. SELECT * FROM tb_report WHERE concluida=false
5. SELECT * FROM tb_report WHERE id_report = id_recebido
6. UPDATE tb_req SET concluida=true WHERE id_report = id_recebido
7. UPDATE tb_campos SET campo=''" WHERE id_tabela = id_recebido
8. SELECT * FROM tb_report WHERE concluida=false
9. INSERT INTO tb_tabela(dados_tabela)  VALUES (dados_nova_tabela)
 */


/**
 * DESCRIPTION
 * PANGEIA is a data catalog application originally made for Banco Pan
 * This file contains the necessary methods to do a CRUD in all relevant tables of the application
 */

/**
 * INSERT METHODS (C)
 */

/**
 * SELECT METHODS (R)
 */
app.get('/search', async (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	let search = req.query.search;
	let index = req.query.index;
	let maxRows = req.query.maxRows;

	let sql = `select * from TB_TABELA limit ${index}, ${maxRows} where TABELA like "%?%"`;
	await DBM.select(sql, [search]).then((result) => {
		res.json(result);
	});
});


app.get('/table', async (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	let id = req.query.id;
});
/**
 * UPDATE METHODS (U)
 */


/**
 * DELETE METHODS (D)
 */
app.post('/remove-table', urlencodedParser, async(req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); 
	let id = res.body.id;
	await DBM.delete("TB_TABELA", ("ID=" + id)).then(async () => {
		await DBM.delete("TB_CONEXAO", ("ID=" + id));
		await DBM.delete("TB_VARIAVEL", ("TABELA=" + id));
		await DBM.delete("TB_CLASSIFICACAO_TABELA", ("ID_TABELA=" + id));
	});
	res.end();
});


app.post('/remove-connection', urlencodedParser, async(req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); 
	let id = res.body.id;
	await DBM.delete("TB_CONEXAO", ("ID_CONEXAO=" + id));
	res.end();
});


app.post('/remove-variable', urlencodedParser, async(req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); 
	let id = res.body.id;
	await DBM.delete("TB_VARIAVEL", ("ID_VARIAVEL=" + id));
	res.end();
});


app.post('/remove-classification', urlencodedParser, async(req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); 
	let id = res.body.id;
	await DBM.delete("TB_CLASSIFICACAO_TABELA", ("ID_CLASSIFICACAO_TABELA=" + id));
	res.end();
});


/**
 * Running the Application
 */
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });