const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 8080;

console.log("Diretório atual:", __dirname);

console.log("Arquivos na raiz:");
console.log(fs.readdirSync(__dirname));

console.log("Arquivos dentro de dist:");
console.log(fs.readdirSync(path.join(__dirname, "dist")));

console.log(
    "Index existe:",
    fs.existsSync(path.join(__dirname, "dist", "index.html"))
);

app.use(express.static(path.join(__dirname, "dist")));

app.use((req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Frontend rodando na porta ${PORT}`);
});