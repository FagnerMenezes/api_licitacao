const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

const orgao = require('./routers/orgaos')
const index = require('./routers/index')
const portal =  require('./routers/portais')
const processo = require('./routers/processos')
const empenho = require('./routers/empenhos')
const modalidade = require('./routers/modalidades')
const tipo_disputa = require('./routers/tipoDisputa')
const status = require('./routers/status')
const bec = require('./routers/bec')

app.use(express.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(cors())

app.use('/api',index)
app.use('/orgaos',orgao)
app.use('/portais',portal)
app.use('/processos',processo)
app.use('/modalidades',modalidade)
app.use('/tipo_disputa',tipo_disputa),
app.use('/status',status)
app.use('/empenhos',empenho)
app.use('/bec',bec)

const port = process.env.PORT || 21138
app.listen(port, (err) =>{
    if (err) return console.log(err)
    console.log(`api rodando na porta ${port}`)
})

module.exports =  app