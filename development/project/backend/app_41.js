const express = require('express'); 
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const sqlite3 = require('sqlite3').verbose();
const DBPATH = 'data/project.db';

const hostname = '127.0.0.3';
const port = 3032;
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
		});
	} else {
		return new Promise((resolve, reject) => {
			let db = new sqlite3.Database(dbpath); // Abre o banco
			returnPromiseWithDBRunExistent(db, sql).then((rows) => {
				resolve(rows);
			}).catch((err) => {
				reject(err);
			});
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
		});
	});
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
		});
	});
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
					tbRequisicaoId = resolve[0]["last_insert_rowid()"];
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
			});
		});
	}
});

app.post('/insereTab', urlencodedParser, async (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); 
	let insert = JSON.parse(req.body.data);

	let idTabela = req.body.id_tabela;
	let tbTabelaId = insert["idTabela"];	
	let db = new sqlite3.Database(DBPATH); // Abre o banco

	let sql = "INSERT INTO TB_TABELA (ID, CONJUNTODADOS_PRODUTO, ID_TABELA, TABELA, CONTEUDO_TABELA, CRITICIDADE_TABELA, DADOS_SENSIVEIS, DEFASAGEM, DATABASE, CAMINHO, SCRIPTS_ALIMENTACAO,ENG_INGESTAO, OWNER, STEWARD,INDICADORAJUSTENOMENCLATURATABELA, LINK_SOL_ACESSO, LINK_REPORTAR_ERRO,RANKING_GOVERNANCA, QTD_VIZUALIZACAO ) VALUES ('" + tbTabelaId + 
	"', '" + insert['CONJUNTODADOS_PRODUTO'] + "', '" + insert['ID_TABELA'] + "', '" + insert['TABELA'] + "', '" + insert['CONTEUDO_TABELA']  + "', '" + insert['CRITICIDADE_TABELA'] + 
	"', '" + insert['DADOS_SENSIVEIS'] + "', '" + insert['DEFASAGEM'] + "', '" + insert['DATABASE'] + "', '" + insert['CAMINHO'] + "', '" + insert['SCRIPTS_ALIMENTACAO'] + "', '" + insert['ENG_INGESTAO'] + "', '" + insert['OWNER'] + "', '" + insert['STEWARD'] + "', '" + insert['INDICADORAJUSTENOMENCLATURATABELA'] + "', '" + insert['LINK_SOL_ACESSO'] + 
	"', '" + insert['LINK_REPORTAR_ERRO'] + "', '" + insert['RANKING_GOVERNANCA'] + "', '" + insert['QTD_VIZUALIZACAO']+ "');";
	await returnPromiseWithDBRunExistent(db, sql).then(async (resolve) => {
		sql = "SELECT last_insert_rowid();";
		await returnPromiseWithDBAllExistent(db, sql).then(async (resolve) => {
			if (resolve[0]["last_insert_rowid()"]) {
				tbTabelaId = resolve[0]["last_insert_rowid()"]
			}

			db.close();

			for (let TbConexao of insert["CONEXAO"]) {
				sql = "INSERT INTO TB_CONEXAO (ID, CONJUNTODADOS_PRODUTO, TABELA, ORDEM_ORIGEM, TABELA_ORIGEM, SISTEMA_ORIGEM, SERVIDOR_ORIGEM, DATABASE_ORIGEM, SCHEMA_ORIGEM, TIPO_CONEXAO, REPOSITORIO, MECANICA, FREQUENCIA, MODO_ESCRITA) VALUES ('" + tbTabelaId + 
				"','" + TbConexao['CONJUNTODADOS_PRODUTO'] + "','" + TbConexao ['TABELA'] + "','"  + TbConexao ['ORDEM_ORIGEM'] + "','"  + TbConexao ['TABELA_ORIGEM'] + "','"  + TbConexao ['SISTEMA_ORIGEM'] +
				"','"  + TbConexao ['SERVIDOR_ORIGEM'] + "','"  + TbConexao ['DATABASE_ORIGEM'] + "','" + TbConexao ['SCHEMA_ORIGEM'] + "','"   + TbConexao ['TIPO_CONEXAO'] + "','"  + TbConexao ['REPOSITORIO'] + "','"  + TbConexao ['MECANICA'] + "','"  + TbConexao ['FREQUENCIA'] +
				"','" + TbConexao ['MODO_ESCRITA'] + "');";
				await returnDBAsPromise(sql, DBPATH);
			}

			for (let TbVariavel of insert["VARIAVEL"]) {
				sql = "INSERT INTO TB_VARIAVEL (ID, CONJUNTO_DADOS, NOME_CAMPO, TIPO_CAMPO, TAMANHO_CAMPO, TIPO_PESSOA, DESCRCAO_CAMPO, CH_PRIMARIA, NULL, UNIQ, LGPD, REGRA_CRIACAO, INDICADOR_AJUSTE_NOMENCLATURA_TABELA ) VALUES ('" + tbTabelaId + 
				"','" + TbVariavel['CONJUNTO_DADOS'] + "','" + TbVariavel['NOME_CAMPO'] + "','" + TbVariavel['TIPO_CAMPO'] + "','" + TbVariavel['TAMANHO_CAMPO'] + "','" + TbVariavel['CTIPO_PESSOA'] + "','" + TbVariavel['DESCRICAO_CAMPO'] +
				"','" + TbVariavel['CH_PRIMARIA'] + "','" + TbVariavel['NULL'] + "', '"  + TbVariavel['UNIQ'] + "','" + TbVariavel['LGPD']+"','" + TbVariavel['REGRA_CRIACAO']+ "','" + TbVariavel['INDICADOR_AJUSTE_NOMENCLATURA_TABELA']+"');";
				await returnDBAsPromise(sql, DBPATH);
			}

			for (let TbClassificacao of insert["CLASSIFICACAO"]) {
				sql = "INSERT INTO TB_CLASSIFICACAO_TABELA  (ID_CLASSIFICACAO_TABELA, ID_TABELA, ID_VALOR_CLASSIFICACAO) VALUES ('" + tbTabelaId + 
				"','" + TbClassificacao['ID_TABELA'] + 
				"', '" + TbClassificacao['ID_VALOR_CLASSIFICACAO'] + "');";
				await returnDBAsPromise(sql, DBPATH);
			}	
		});
	});
	res.end();
});


app.listen(port, hostname, () => {
  console.log(`Servidor rodando em http://${hostname}:${port}/`);
});