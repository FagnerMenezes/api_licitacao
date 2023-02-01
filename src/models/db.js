const mongose = require('mongoose');

const urlweb = 'mongodb+srv://fagner:281084@cluster0.dv0n11i.mongodb.net/licitacao';

const conn = mongose.connect(urlweb).then(() => {
    console.log('conectado');
});
module.exports = {
    conn
};