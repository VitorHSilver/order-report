require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const moment = require('moment-timezone');

const dbPath = process.env.DB_PATH || 'C:/Users/Vitor/banco_db';

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
     db.run(
          'CREATE TABLE IF NOT EXISTS product (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, qtd INTEGER, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);'
     );

     const itens = [
          'carne',
          'linguiça',
          'frango',
          'coração',
          'kafta',
          'queijo qualho',
          'queijo muçarela',
          'tulipa',
          'medalhão carne',
          'medalhão frango',
          'medalhão queijo',
          'medalhão mandioca',
          'misto',
          'linguiça apimentada',
     ];

     insertData(itens); // Insere os itens com quantidade 10
     showAllDates(); // Mostra todos os registros
     // dropTable();
});

function insertData(itens, qtd) {
     const stmt = db.prepare('INSERT INTO product (name, qtd, created_at) VALUES (?, ?, ?)');
     itens.forEach((item) => {
          const createdAt = moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss');
          stmt.run(item, qtd, createdAt, (err) => {
               if (err) {
                    console.error(err.message);
               }
          });
     });
     stmt.finalize();
}

function showAllDates() {
     db.each('SELECT id, name, qtd, created_at FROM product', (err, row) => {
          if (err) {
               console.error(err.message);
          } else {
               console.log(row.id + ': ' + row.name + ' - ' + row.qtd + ' - ' + row.created_at);
          }
     });
}
function dropTable() {
     db.run('DROP TABLE IF EXISTS product', (err) => {
          if (err) {
               console.error(err.message);
          } else {
               console.log('Table dropped successfully.');
          }
     });
}

module.exports = { insertData, showAllDates };
