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
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "titles1997",
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [User, Employee, Position, Supplier, Category, Item, ItemMappingSupplier, PO_Request, PO_Item, Status],
    migrations: [],
    subscribers: [],
})
