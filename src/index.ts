import { ExtendedClient } from "./structs/ExtendedClient";
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import License  from './schemas/licenseSchema';
export * from "colors";

const client = new ExtendedClient();

const app = express();
const port = "3000"

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/licenses/api/checker/:name/:license', async (req: Request, res: Response) => {
  
    const name = req.params.name;
    const license = req.params.license;
  
    try {
      const licenses = await License.findOne({ plugin: name, license: license });
  
      if (licenses) {
        res.json({ exists: true });
      } else {
        res.json({ exists: false });
      }
    } catch (error) {
      res.status(500).json({ error: 'Erro ao verificar a licença.' });
    }
  });
  
app.listen(port, () => {
    console.log(`Backend rodando em http://localhost:${port}`.green);
    client.start();
  });

export { client }