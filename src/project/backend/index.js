const express = require('express');  
const DBManager = require('./classes/DBManager.js');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const DBPATH = 'data/project.db';
const DBM = new DBManager(DBPATH)

const hostname = '127.0.0.1';
const port = 3000;
const app = express();


app.use(express.json());


/**
 * DESCRIPTION
 * PANGEIA is a data catalog application originally made for Banco Pan
 * This file contains the necessary methods to do a CRUD in all relevant tables of the application
 */

/**
 * INSERT METHODS (C)
 */

/**
 * Endpoint that insert new data in TB_REQUISICAO
 * @param {Object} data 
 */
app.post('/insert-req', urlencodedParser, async (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	let data = JSON.parse(req.body.data);
	
	for (let request of data) {
		let columns = ['ID_TABELA', 'USUARIO', 'JUSTIFICATIVA', 'ID_STATUS'];
		let values = [ 
			request['id_tabela'], request['user'], request['justify'],
			request['status']
		];
		DBM.insertReturningTheInsertedDataID("TB_REQUISICAO", columns, values).then(async (result) => {
			let tbRequisicaoId = result[0]["last_insert_rowid()"];
			for (let reqsTabela of request["reqs_tabela"]) {
				columns = ["ID_REQUISICAO", "ID_CAMPO_TABELA", "ALTERACAO"];
				values = [tbRequisicaoId, reqsTabela['id_campo_tabela'], reqsTabela['alteracao']];
				await DBM.insert("TB_REQ_TABELA", columns, values);
			}

			for (let reqsVariavel of request["reqs_variavel"]) {
				columns = ["ID_REQUISICAO", "ID_CAMPO_VARIAVEL", "ALTERACAO"];
				values = [tbRequisicaoId, reqsVariavel['id_campo_variavel'], reqsVariavel['alteracao']];
				await DBM.insert("TB_REQ_VARIAVEL", columns, values);
			}

			for (let reqsConexao of request["reqs_conexao"]) {
				columns = ["ID_REQUISICAO", "ID_CAMPO_CONEXAO", "ALTERACAO"];
				values = [tbRequisicaoId, reqsConexao['id_campo_conexao'], reqsConexao['alteracao']];
				await DBM.insert("TB_REQ_CONEXAO", columns, values);
			}
		});
	}
	res.end();

	/**
	 * The data JSON should be in this pattern:
	 * [
	 *		{
	 *			"id_tabela": "autmato",
	 *			"user": "juninho",
	 *			"justify": "justify",
	 *			"status": 0,
	 *			"reqs_tabela": [{
	 *				"id_campo_tabela": 1,
	 *				"alteracao": " t"
	 *			}],
	 *			"reqs_variavel": [{
	 *					"id_campo_variavel": 4,
	 *					"alteracao": " "
	 *				},
	 *				{
	 *					"id_campo_variavel": 4,
	 *					"alteracao": " "
	 *				}
	 *			],
	 *			"reqs_conexao": [{
	 *					"id_campo_conexao": 4,
	 *					"alteracao": ""
	 *				},
	 *				{
	 *					"id_campo_conexao": 4,
	 *					"alteracao": ""
	 *				}
	 *			]
	 *		}
	 *	]
	 */
});


/**
 * Endpoint that insert new data in TB_TABELA
 * @param {Object} data 
 */
app.post('/insert-tb', urlencodedParser, async (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	let data = JSON.parse(req.body.data);

	for (let insert of data) {
		let columns = [
			"ID", "CONJUNTODADOS_PRODUTO", "ID_TABELA", "TABELA", "CONTEUDO_TABELA", 
			"CRITICIDADE_TABELA", "DADOS_SENSIVEIS", "DEFASAGEM", "DATABASE", "CAMINHO", 
			"SCRIPTS_ALIMENTACAO","ENG_INGESTAO", "OWNER", "STEWARD","INDICADORAJUSTENOMENCLATURATABELA", 
			"LINK_SOL_ACESSO", "LINK_REPORTAR_ERRO","RANKING_GOVERNANCA", "QTD_VIZUALIZACAO" 
		];
		
		let values = [
			insert['ID'], insert['CONJUNTODADOS_PRODUTO'], insert['ID_TABELA'], insert['TABELA'], 
			insert['CONTEUDO_TABELA'], insert['CRITICIDADE_TABELA'], insert['DADOS_SENSIVEIS'], insert['DEFASAGEM'], 
			insert['DATABASE'], insert['CAMINHO'], insert['SCRIPTS_ALIMENTACAO'], insert['ENG_INGESTAO'], 
			insert['OWNER'], insert['STEWARD'], insert['INDICADORAJUSTENOMENCLATURATABELA'], insert['LINK_SOL_ACESSO'],
			insert['LINK_REPORTAR_ERRO'], insert['RANKING_GOVERNANCA'], insert['QTD_VIZUALIZACAO']
		];
		
		await DBM.insert("TB_TABELA", columns, values).then(async (results) => {	
			let tbTabelaId = insert['ID'];
			for (let TbConexao of insert["CONEXAO"]) {
				columns = [
					"ID", "CONJUNTODADOS_PRODUTO", "TABELA", "ORDEM_ORIGEM", "TABELA_ORIGEM", "SISTEMA_ORIGEM", "SERVIDOR_ORIGEM", 
					"DATABASE_ORIGEM", "SCHEMA_ORIGEM", "TIPO_CONEXAO", "REPOSITORIO", "MECANICA", "FREQUENCIA", "MODO_ESCRITA"
				];

				values = [
					tbTabelaId, insert['CONJUNTODADOS_PRODUTO'], insert['TABELA'], TbConexao['ORDEM_ORIGEM'], 
					TbConexao['TABELA_ORIGEM'], TbConexao['SISTEMA_ORIGEM'], TbConexao['SERVIDOR_ORIGEM'], TbConexao['DATABASE_ORIGEM'],
					TbConexao['SCHEMA_ORIGEM'], TbConexao['TIPO_CONEXAO'], TbConexao['REPOSITORIO'], TbConexao['MECANICA'], 
					TbConexao['FREQUENCIA'], TbConexao['MODO_ESCRITA']
				];

				await DBM.insert("TB_CONEXAO", columns, values);
			}

			for (let TbVariavel of insert["VARIAVEL"]) {
				columns = [
					"CONJUNTODADOS_PRODUTO", "TABELA", "NOME_CAMPO", "TIPO_CAMPO", "TIPO_PESSOA", 
					"DESCRICAO_CAMPO", "VOLATIL", "CH_PRIMARIA", "ACCEPT_NULL", "UNQ", "LGPD"
				];
					
				values = [
					insert['CONJUNTODADOS_PRODUTO'], tbTabelaId, TbVariavel['NOME_CAMPO'], TbVariavel['TIPO_CAMPO'], 
					TbVariavel['TIPO_PESSOA'], TbVariavel['DESCRICAO_CAMPO'], TbVariavel['VOLATIL'], 
					TbVariavel['CH_PRIMARIA'], TbVariavel['ACCEPT_NULL'], TbVariavel['UNQ'], TbVariavel['LGPD']
				];
			
				await DBM.insert("TB_VARIAVEL", columns, values);
			}

			for (let TbClassificacao of insert["CLASSIFICACAO"]) {
				columns = [
					"ID_TABELA", "ID_VALOR_CLASSIFICACAO"
				];

				values = [
					tbTabelaId, TbClassificacao['ID_VALOR_CLASSIFICACAO']
				];

				await DBM.insert("TB_CLASSIFICACAO_TABELA", columns, values);
			}
		});
	}
	res.end();

	/**
	 * This insert receives a JSON that should be in this pattern:
	 * [
	 *		{
	 *			"ID": "database.tabela2",
	 *			"CONJUNTODADOS_PRODUTO": "Engenharia de Dados",
	 *			"ID_TABELA": "AWS.CLOUDTRAIL_AWSLOGS_TEMP",
	 *			"TABELA": "CLOUDTRAIL_AWSLOGS_TEMP",
	 *			"CONTEUDO_TABELA": "Tabela contém log de eventos do ambiente do Data Lake.",
	 *			"CRITICIDADE_TABELA": null,
	 *			"DADOS_SENSIVEIS": null,
	 *			"DEFASAGEM": null,
	 *			"DATABASE": "DB_PAN_DL_CURATED",
	 *			"CAMINHO": "s3://pansegs3bucketcloudtrailprod/awslogs/135628704092/cloudtrail/us-east-1/2022/05/06/",
	 *			"SCRIPTS_ALIMENTACAO": "-",
	 *			"ENG_INGESTAO": "-",
	 *			"OWNER": "Samir Migliani",
	 *			"STEWARD": "Rafael Cordeiro de Araujo",
	 *			"INDICADORAJUSTENOMENCLATURATABELA": "S",
	 *			"LINK_SOL_ACESSO": null,
	 *			"LINK_REPORTAR_ERRO": null,
	 *			"RANKING_GOVERNANCA": null,
	 *			"QTD_VIZUALIZACAO": null,
	 *			"CONEXAO": [{
	 *				"ORDEM_ORIGEM": 1,
	 *				"TABELA_ORIGEM": null,
	 *				"SISTEMA_ORIGEM": null,
	 *				"SERVIDOR_ORIGEM": null,
	 *				"DATABASE_ORIGEM": null,
	 *				"SCHEMA_ORIGEM": null,
	 *				"TIPO_CONEXAO": null,
	 *				"REPOSITORIO": null,
	 *				"MECANICA": null,
	 *				"FREQUENCIA": null,
	 *				"MODO_ESCRITA": null
	 *			}],
	 *			"VARIAVEL": [{
	 *				"NOME_CAMPO": "ALGO",
	 *				"TIPO_CAMPO": "SOMETHING",
	 *				"TIPO_PESSOA": "PJ",
	 *				"DESCRICAO_CAMPO": "SIM",
	 *				"VOLATIL": "N",
	 *				"CH_PRIMARIO": "N",
	 *				"NULL": "N",
	 *				"UNQ": "N",
	 *				"LGPD": "G"
	 *			}],
	 *			"CLASSIFICACAO": [
	 *				{
	 *					"ID_VALOR_CLASSIFICACAO": "TXT"
	 *				}
	 *			]
	 *		}
	 *	]
	 */
});


/**
 * SELECT METHODS (R)
 */

/**
 * Endpoint that search data in TB_TABELA and it's children
 * @param {String} q
 * @param {Integer} index
 * @param {Integer} maxRows  
 * @returns {JSON}
 */
app.get('/search', async (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	let q = req.query.q;
	let index = req.query.index;
	let maxRows = req.query.maxRows;
	let value = "%" + q + "%";
	let sql = `select * from TB_TABELA where TABELA like ? limit ${index}, ${maxRows}`;
	await DBM.select(sql, [value]).then((result) => {
		res.json(result);
	});
});


/**
 * Endpoint that search data in TB_TABELA and it's children
 * @param {String} id
 * @returns {JSON}
 */
app.get('/table', async (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	let id = req.query.id;
	let sql = "select * from TB_TABELA " +
		"inner join TB_OWNER_STEWARD on " +
		"TB_TABELA.CONJUNTODADOS_PRODUTO = TB_OWNER_STEWARD.ConjuntodeDados " +
		"where ID=?";
	await DBM.select(sql, [id]).then(async (result) => {
		let response = result[0];
		response["CONEXAO"] = await DBM.select("select * from TB_CONEXAO where ID=?", [id]);
		response["VARIAVEL"] = await DBM.select("select * from TB_VARIAVEL where TABELA=?", [id]);
		sql = "select * from TB_CLASSIFICACAO_TABELA where ID_TABELA=?";
		response["CLASSIFICACAO_TABELA"] = await DBM.select(sql, [id]);		
		res.json(response);
	});
});


/**
 * Endpoint that search data in TB_REQUISICAO where ID_STATUS is equal to the status argument
 * @param {Integer} status
 * @returns {JSON}
 */
app.get('/requests', async (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	let status = req.query.status;
	let sql = "select * from TB_REQUISICAO" + " where ID_STATUS=?";
	await DBM.select(sql, [status]).then(async (results) => {
		let response = [];
		for(let index in results) {
			let id = results[index]["ID_REQUISICAO"];
			results[index]["CONEXAO"] = await DBM.select("select * from TB_REQ_CONEXAO where ID_REQUISICAO=?", [id]);
			results[index]["VARIAVEL"] = await DBM.select("select * from TB_REQ_VARIAVEL where ID_REQUISICAO=?", [id]);
			results[index]["TABELA"] = await DBM.select("select * from TB_REQ_TABELA where ID_REQUISICAO=?", [id]);	
			response.push(results[index]);
		}
		res.json(response);
	});
});


/**
 * Endpoint that search data in TB_REQUISICAO where ID_REQUISICAO is equal to the id argument
 * @param {Integer} id
 * @returns {JSON}
 */
app.get('/request', async (req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*');
	let id = req.query.id;
	let sql = "select * from TB_REQUISICAO" + " where ID_REQUISICAO=?";
	await DBM.select(sql, [id]).then(async (request) => {
		let response = request[0];
		let id = request[0]["ID_REQUISICAO"];
		response["CONEXAO"] = await DBM.select("select * from TB_REQ_CONEXAO where ID_REQUISICAO=?", [id]);
		response["VARIAVEL"] = await DBM.select("select * from TB_REQ_VARIAVEL where ID_REQUISICAO=?", [id]);
		response["TABELA"] = await DBM.select("select * from TB_REQ_TABELA where ID_REQUISICAO=?", [id]);	
		res.json(response);
	});
});


/**
 * UPDATE METHODS (U)
 */

/**
 * Endpoint that update the TB_REQUISICAO
 * @param {Object} data
 */
app.post('/update-req', urlencodedParser, async(req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); 
	let data = JSON.parse(req.body.data);

	for(let index in data) {
		let requestUpdate = data[index];
		console.log(requestUpdate);
		let idRequest = requestUpdate["id_requisicao"];
		let columnsAndValues = {
			"ID_STATUS": requestUpdate["status"]
		};
		await DBM.update("TB_REQUISICAO",	columnsAndValues, ("ID_REQUISICAO="+idRequest)).then(() => {
			for(let index in requestUpdate["tb_req_conexao"]) {
				let reqConexao = requestUpdate["tb_req_conexao"][index];
				columnsAndValues = {
					"ALTERACAO_GOVERNANCA": reqConexao["alteracao_governanca"]
				};
				console.log(reqConexao)
				DBM.update("TB_REQ_CONEXAO", columnsAndValues, ("ID_REQ_CONEXAO="+reqConexao["id_req_conexao"]));
			}

			for(let index in requestUpdate["tb_req_tabela"]) {
				let reqTabela = requestUpdate["tb_req_tabela"][index];
				columnsAndValues = {
					"ALTERACAO_GOVERNANCA": reqTabela["alteracao_governanca"]
				};
				console.log(reqTabela);
				DBM.update("TB_REQ_TABELA", columnsAndValues, ("ID_REQ_TABELA="+reqTabela["id_req_tabela"]));
			}

			for(let index in requestUpdate["tb_req_variavel"]) {
				let reqVariavel = requestUpdate["tb_req_variavel"][index];
				columnsAndValues = {
					"ALTERACAO_GOVERNANCA": reqVariavel["alteracao_governanca"]
				};
				DBM.update("TB_REQ_VARIAVEL", columnsAndValues, ("ID_REQ_VARIAVEL="+reqVariavel["id_req_variavel"]));
			}
		});
	}

	res.end();

	/**
	 * Update-req receives a JSON with this pattern:
	 * [
	 * 		{
	 * 			"id_requisicao": 1,
	 * 			"status": 1,
	 * 			"tb_req_conexao": [
	 * 				{
	 * 					"id_req_conexao": 1,
	 * 					"alteracao_governanca": "algo"
	 * 				}
	 * 			],
	 * 			"tb_req_tabela": [
	 * 				{
	 * 					"id_req_tabela": 1,
	 * 					"alteracao_governanca": "algo"
	 * 				}
	 * 			],
	 * "		tb_req_variavel": [
	 * 				{
	 * 					"id_req_variavel": 1,
	 * 					"alteracao_governanca": "algo"
	 * 				}
	 * 			]
	 *		}
	 * ]
	 */
})



/**
 * DELETE METHODS (D)
 */

/**
 * Endpoint that delete data in the TB_TABELA
 * @param {String} id
 */
app.post('/remove-table', urlencodedParser, async(req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); 
	let id = req.body.id;
	await DBM.delete("TB_TABELA", "ID=?", [id]).then(async () => {
		await DBM.delete("TB_CONEXAO", "ID=?", [id]);
		await DBM.delete("TB_VARIAVEL", "TABELA=?", [id]);
		await DBM.delete("TB_CLASSIFICACAO_TABELA", "ID_TABELA=?", [id]);
	});
	res.end();
});


/**
 * Endpoint that delete data in the TB_CONEXAO
 * @param {Integer} id
 */
app.post('/remove-connection', urlencodedParser, async(req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); 
	let id = req.body.id;
	await DBM.delete("TB_CONEXAO", "ID_CONEXAO=?", [id]);
	res.end();
});


/**
 * Endpoint that delete data in the TB_VARIAVEL
 * @param {Integer} id
 */
app.post('/remove-variable', urlencodedParser, async(req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); 
	let id = req.body.id;
	await DBM.delete("TB_VARIAVEL", "ID_VARIAVEL=?", [id]);
	res.end();
});


/**
 * Endpoint that delete data in the TB_CLASSIFICACAO_TABELA
 * @param {Integer} id
 */
app.post('/remove-classification', urlencodedParser, async(req, res) => {
	res.statusCode = 200;
	res.setHeader('Access-Control-Allow-Origin', '*'); 
	let id = req.body.id;
	await DBM.delete("TB_CLASSIFICACAO_TABELA", "ID_CLASSIFICACAO_TABELA=?", [id]);
	res.end();
});


/**
 * Running the Application
 */
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });