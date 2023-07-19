import { ExtendedClient } from "./structs/ExtendedClient";
import express, { Request, Response, NextFunction } from 'express';
import { param, validationResult } from 'express-validator'
import License from './schemas/licenseSchema';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import AdmZip from 'adm-zip';
export * from "colors";

const client = new ExtendedClient();

const app = express();
const port = "3000"

app.use(express.json());

// Verificar licença
app.get('/licenses/api/checker/:name/:license', [
  param('name').notEmpty().withMessage('O parâmetro "name" é obrigatório.'),
  param('license').notEmpty().withMessage('O parâmetro "license" é obrigatório.'),
],

async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const name = req.params.name;
  const license = req.params.license;

  try {
    const licenseData = await License.findOne({ plugin: name, license: license });

    const client =
      req.headers['cf-connecting-ip'] ||
      req.headers['x-real-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress;
    const server = licenseData?.enderess;

    if (!licenseData) {
      return res.json({ success: false, data: "Licença inválida." });
    }
    
    const formattedClient = client?.toString().replace('::ffff:', '');
    const formattedServer = server?.toString().replace('::ffff:', '');

    if (server && formattedClient === formattedServer) {
      return res.json({ success: true, data: licenseData });
    } else {
      return res.status(403).json({ error: 'Endereço não autorizado.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao verificar a licença.' });
  }
});

  // Baixar a jar...
  // Toma cuidado
  // Pelo amor de deus
  app.get('/licenses/api/download/:name/:license', [
    param('name').notEmpty().withMessage('O parâmetro "name" é obrigatório.'),
    param('license').notEmpty().withMessage('O parâmetro "license" é obrigatório.'),
  ],
  
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const name = req.params.name;
    const license = req.params.license;
  
    try {
      const licenseData = await License.findOne({ plugin: name, license: license });
  
      if (!licenseData) {
        return res.json({ success: true, data: "Licença válida." });
      }
  
      let newFileName = '';
      if (name === 'skywars') {
        newFileName = 'ReachSkyWars.jar';
      } else if (name === 'thebridge') {
        newFileName = 'ReachTheBridge.jar';
      } else {
        return res.status(400).json({ error: 'Plugin não suportado.' });
      }
  
      const originalFilePath = path.join('dist/jars', `${name}.jar`);
      const temporaryFilePath = path.join('dist/jars', `${newFileName}`);
  
      fs.copyFileSync(originalFilePath, temporaryFilePath);
  
      const configYmlPath = 'config.yml';
  
      const jar = new AdmZip(temporaryFilePath);
      const configYmlEntry = jar.getEntry(configYmlPath);
      if (!configYmlEntry) {
        throw new Error(`O arquivo ${configYmlPath} não foi encontrado na JAR.`);
      }
      const configYmlContent = jar.readAsText(configYmlEntry);
  
      const config = yaml.load(configYmlContent) as Record<string, any>;
  
      config.key = `${license}`;
  
      const modifiedConfigYmlContent = yaml.dump(config);
  
      const modifiedConfigYmlBuffer = Buffer.from(modifiedConfigYmlContent, 'utf8');
      jar.updateFile(configYmlEntry.entryName, modifiedConfigYmlBuffer);
      jar.writeZip(temporaryFilePath);
  
      res.download(temporaryFilePath, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Erro ao fazer o download do arquivo.' });
        }
  
        fs.unlinkSync(temporaryFilePath); // Remove o arquivo temporário após o download ser concluído
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao verificar a licença.' });
    }
  });
  


app.listen(port, () => {
  console.log(`Backend rodando em http://164.152.48.107:${port}`);
  client.start();
});

export { client }