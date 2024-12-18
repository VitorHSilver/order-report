declare module 'database' {
     export function insertData(itens: string[], qtd: number): void;
     export function showAllDates(): void;
     export function dropTable(): void;
}

export default function insertData(itens, qtd) {
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
