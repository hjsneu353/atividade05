const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3000;

// Configuração do Middleware (para ler JSON e permitir acesso do front)
app.use(express.json());
app.use(cors());

// 1. Configuração do Banco de Dados SQLite
const db = new sqlite3.Database('./loja.db', (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        // Cria a tabela se ela não existir
        db.run(`CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            preco REAL
        )`);
    }
});

// 2. Rota para LISTAR produtos (GET)
app.get('/produtos', (req, res) => {
    const sql = "SELECT * FROM produtos";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows
        });
    });
});

// 3. Rota para ADICIONAR produtos (POST)
app.post('/produtos', (req, res) => {
    const { nome, preco } = req.body;
    const sql = "INSERT INTO produtos (nome, preco) VALUES (?, ?)";
    const params = [nome, preco];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: { id: this.lastID, nome, preco }
        });
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});