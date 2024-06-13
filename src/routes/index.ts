import {Router} from "express"
import productos from "./productos";

const routes= Router();

routes.use("/Productos", productos )


export default routes;

