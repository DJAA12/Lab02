import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Productos } from "./entity/Productos"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "dblab2",
    synchronize: true,
    logging: false,
    entities: [User, Productos],
    migrations: [],
    subscribers: [],
})
