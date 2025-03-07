import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Status } from "./entity/Status"
import { Employee } from "./entity/Employee"
import { Position } from "./entity/Position"
import { Supplier } from "./entity/Supplier"
import { Category } from "./entity/Category"
import { Item } from "./entity/Item"
import { ItemMappingSupplier } from "./entity/ItemMappingSupplier"
import { PO_Request } from "./entity/PO_Request"
import { PO_Item } from "./entity/PO_Item"

export const AppDataSource = new DataSource({
    // url: "postgresql://test_gxe8_user:AB8FZ6QhrtilWfPHyIvkHqfVjeCupqbA@dpg-cv29oejtq21c73deprr0-a.singapore-postgres.render.com/test_gxe8",
    type: "postgres",
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    synchronize: true,
    logging: false,
    entities: [User, Employee, Position, Supplier, Category, Item, ItemMappingSupplier, PO_Request, PO_Item, Status],
    migrations: [],
    subscribers: [],
})
