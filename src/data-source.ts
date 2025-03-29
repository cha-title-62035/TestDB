import "reflect-metadata"
import { DataSource } from "typeorm"
import { User_TestDB } from "./entity/User"
import { Status_TestDB } from "./entity/Status"
import { Employee_TestDB } from "./entity/Employee"
import { Position_TestDB } from "./entity/Position"
import { Supplier_TestDB } from "./entity/Supplier"
import { Category_TestDB } from "./entity/Category"
import { Item_TestDB } from "./entity/Item"
import { ItemMappingSupplier_TestDB } from "./entity/ItemMappingSupplier"
import { PO_Request_TestDB } from "./entity/PO_Request"
import { PO_Item_TestDB } from "./entity/PO_Item"
import * as dotenv from "dotenv"

dotenv.config();

const { PG_HOST, PG_PORT, PG_USERNAME, PG_PASSWORD, PG_DATABASE, PG_URL } = process.env

export const AppDataSource = new DataSource({
    // url: "postgresql://test_gxe8_user:AB8FZ6QhrtilWfPHyIvkHqfVjeCupqbA@dpg-cv29oejtq21c73deprr0-a.singapore-postgres.render.com/test_gxe8",
    type: "postgres",
    url: PG_URL,//process.env.PG_URL|| "postgresql://test_gxe8_user:AB8FZ6QhrtilWfPHyIvkHqfVjeCupqbA@dpg-cv29oejtq21c73deprr0-a.singapore-postgres.render.com/test_gxe8",
    // host: process.env.PG_HOST || "cv29oejtq21c73deprr0-a.singapore-postgres.render.com",
    // port: Number(process.env.PG_PORT) || 5432,
    // username: process.env.PG_USERNAME || "test_gxe8_user",
    // password: process.env.PG_PASSWORD || "AB8FZ6QhrtilWfPHyIvkHqfVjeCupqbA",
    // database: process.env.PG_DATABASE || "test_gxe8",
    synchronize: true,
    logging: false,
    entities: [User_TestDB, Employee_TestDB, Position_TestDB, Supplier_TestDB, Category_TestDB, Item_TestDB, ItemMappingSupplier_TestDB, PO_Request_TestDB, PO_Item_TestDB, Status_TestDB],
    ssl: true,
    migrations: [],
    subscribers: [],
})
