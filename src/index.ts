import * as express from "express"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import cors = require("cors")
import helmet from "helmet"
import routes from "./routes"


const PORT = process.env.PORT || 3000;
AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(cors());
    app.use(helmet());
    app.use(express.json())


    //routessssss
     app.use('/',routes);
    // start express server
    app.listen(PORT,()=>{ console.log(`El servidor a sido levantado en el puerto: ${PORT} `);
});
   
}).catch(error => console.log(error))
