const fs = require('fs').promises;
const express = require('express');
const app = express();
const port = 3000;

app.use((req, res, next) => {
    const origin = req.get('origin');
    res.header('Access-Control-Allow-Origin', origin);
    next();
});

app.get('/', async (req, res) => {
    var response = {
        view: ""
    }
    try {
        response.view = await fs.readFile('./dashboard1/dashboard1.html', 'utf8');
        response.script = await fs.readFile('./dashboard1/dashboard1.js', 'utf8');
    } catch (erro) {
        console.error('Ocorreu um erro ao ler o arquivo:', erro);
    }
    res.send(JSON.stringify(response));
});

app.listen(port, () => {
    console.log(`Servidor Express está ouvindo na porta ${port}`);
});