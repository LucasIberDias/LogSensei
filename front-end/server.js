import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 8080;

const buildPath = path.join(__dirname, "build");
const indexPath = path.join(buildPath, "index.html");

if (!fs.existsSync(indexPath)) {
    console.log("build não encontrado. Executando npm run build...");

    execSync("npm run build", {
        stdio: "inherit",
        cwd: __dirname
    });
}

app.use(express.static(buildPath));

app.use((req, res) => {
    res.sendFile(indexPath);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Frontend rodando na porta ${PORT}`);
});