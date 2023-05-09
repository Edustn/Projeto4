const express = require('express'); 
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const sqlite3 = require('sqlite3').verbose();
const DBPATH = 'data/project.db';

const hostname = '127.0.0.1';
const port = 3002;
const app = express();

/* Definição dos endpoints */
/******** CRUD ************/
app.use(express.json());

async function returnDBAsPromise(sql, dbpath, mode="run") {
	if (mode == "all") {
		return new Promise((resolve, reject) => {
			let db = new sqlite3.Database(dbpath); // Abre o banco
			returnPromiseWithDBAllExistent(db, sql).then((rows) => {
				resolve(rows);
			}).catch((err) => {
				reject(err);
			})
			db.close(); // Fecha o banco
		})
	} else {
		return new Promise((resolve, reject) => {
			let db = new sqlite3.Database(dbpath); // Abre o banco
			returnPromiseWithDBRunExistent(db, sql).then((rows) => {
				resolve(rows);
			}).catch((err) => {
				reject(err);
			})
			db.close(); // Fecha o banco
		})
	}

}

async function returnPromiseWithDBRunExistent(db, sql) {
	return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.run(sql, [],  (err, rows ) => {
				if (err) {
					reject(err);
				}
				resolve(rows)
			});
		})
	})
}

async function returnPromiseWithDBAllExistent(db, sql) {
	return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.all(sql, [],  (err, rows ) => {
				if (err) {
					reject(err);
				}
				resolve(rows)
			});
		})
	})
}


// Insere um registro (é o C do CRUD - Create)
app.post('/insereReq', urlencodedParser, async (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); 
	let data = JSON.parse(req.body.data);
	
	for (let request of data) {
		let tbRequisicaoId		
		let db = new sqlite3.Database(DBPATH); // Abre o banco

		let sql = "INSERT INTO TB_REQUISICAO (ID_TABELA, USUARIO, ID_STATUS) VALUES ('" + request['id_tabela'] + 
		"', '" + request['user'] + "', 0);";
		await returnPromiseWithDBRunExistent(db, sql).then(async (resolve) => {
			sql = "SELECT last_insert_rowid();";
			await returnPromiseWithDBAllExistent(db, sql).then(async (resolve) => {
				if (resolve[0]["last_insert_rowid()"]) {
					tbRequisicaoId = resolve[0]["last_insert_rowid()"]
				}

				db.close();

				for (let reqsTabela of request["reqs_tabela"]) {
					sql = "INSERT INTO TB_REQ_TABELA (ID_REQUISICAO, ID_CAMPO_TABELA, ALTERACAO) VALUES ('" + tbRequisicaoId + 
					"','" + reqsTabela['id_campo_tabela'] + 
					"', '" + reqsTabela['alteracao'] + "');";
					await returnDBAsPromise(sql, DBPATH);
				}

				for (let reqsVariavel of request["reqs_variavel"]) {
					sql = "INSERT INTO TB_REQ_VARIAVEL (ID_REQUISICAO, ID_CAMPO_VARIAVEL, ALTERACAO) VALUES ('" + tbRequisicaoId + 
					"','" + reqsVariavel['id_campo_variavel'] + 
					"', '" + reqsVariavel['alteracao'] + "');";
					await returnDBAsPromise(sql, DBPATH);
				}

				for (let reqsConexao of request["reqs_conexao"]) {
					sql = "INSERT INTO TB_REQ_CONEXAO (ID_REQUISICAO, ID_CAMPO_CONEXAO, ALTERACAO) VALUES ('" + tbRequisicaoId + 
					"','" + reqsConexao['id_campo_conexao'] + 
					"', '" + reqsConexao['alteracao'] + "');";
					await returnDBAsPromise(sql, DBPATH);
				}



			})
			
		})


		/*
		console.log(db.last_insert_rowid());
		let id = db.last_insert_rowid()
		res.write('<p>REQUISICAO  FEITA COM SUCESSO!</p><a href="/">VOLTAR</a>');
		db.close(); // Fecha o banco

		request['reqs_variavel'].forEach(reqVar => {
			sql = "INSERT INTO TB_REQ_VARIAVEL (ID_REQUISICAO, ID_CAMPO_VARIAVEL, ALTERACAO) VALUES ('" + tbRequisicaoId + 
			"''" + request['id_campo_variavel'] + 
			"', '" + request['alteracao'] + "');";
			db.run(sql, [],  err => {
				if (err) {
					throw err;
				}	
			});
	
			sql = "SELECT last_insert_rowid();";
			db.all(sql, [],  (err, rows) => {
				if (err) {
					throw err;
				}
	
				tbRequisicaoId = rows
			});	
			
			console.log(db.last_insert_rowid());
			let id = db.last_insert_rowid()
			res.write('<p>REQUISICAO DE ALTERAÇÃO FEITA COM SUCESSO!p><a href="/">VOLTAR</a>');
			db.close(); // Fecha o banco
		});

		request['reqs_tabela'].forEach(reqTab => {
			sql = "INSERT INTO TB_REQ_TABELA (ID_REQUISICAO, ID_CAMPO_TABELA, ALTERACAO) VALUES ('" + tbRequisicaoId + 
			"''" + request['id_campo_tabela'] + 
			"', '" + request['alteracao'] + "');";
			db.run(sql, [],  err => {
				if (err) {
					throw err;
				}	
			});
	
			sql = "SELECT last_insert_rowid();";
			db.all(sql, [],  (err, rows) => {
				if (err) {
					throw err;
				}
	
				tbRequisicaoId = rows
			});	
			
			console.log(db.last_insert_rowid());
			let id = db.last_insert_rowid()
			res.write('<p>REQUISICAO DE ALTERAÇÃO FEITA COM SUCESSO!p><a href="/">VOLTAR</a>');
			db.close(); // Fecha o banco
		});

		request['reqs_conexao'].forEach(reqCon=> {
			sql = "INSERT INTO TB_REQ_CONEXAO (ID_REQUISICAO, ID_CAMPO_CONEXAO, ALTERACAO) VALUES ('" + tbRequisicaoId + 
			"''" + request['id_campo_CONEXAO'] + 
			"', '" + request['alteracao'] + "');";
			db.run(sql, [],  err => {
				if (err) {
					throw err;
				}	
			});
	
			sql = "SELECT last_insert_rowid();";
			db.all(sql, [],  (err, rows) => {
				if (err) {
					throw err;
				}
	
				tbRequisicaoId = rows
			});	
			
			console.log(db.last_insert_rowid());
			let id = db.last_insert_rowid()
			res.write('<p>REQUISICAO DE ALTERAÇÃO FEITA COM SUCESSO!p><a href="/">VOLTAR</a>');
			db.close(); // Fecha o banco
		});
		*/
	}
	res.end();
});

app.listen(port, hostname, () => {
  console.log(`Servidor rodando em http://${hostname}:${port}/`);
});