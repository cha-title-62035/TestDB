import { AuthController } from "./controller/AuthController"
import { CategoryController } from "./controller/CategoryController"
import { EmployeeController } from "./controller/EmployeeController"
import { ItemController } from "./controller/ItemController"
import { ItemMappingSupplierController } from "./controller/ItemMappingSupplierController"
import { PO_ItemController } from "./controller/PO_ItemController"
import { PO_RequestController } from "./controller/PO_RequestController"
import { PositionController } from "./controller/PositionController"
import { StatusController } from "./controller/StatusController"
import { SupplierController } from "./controller/SupplierController"
import { UserController } from "./controller/UserController"
import { authentification } from "./middleware/authentification"

export const Routes = [/*{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all"
},*/

    //User
{
    method: "get",
    route: "/users",
    //authentification: authentification,
    controller: UserController,
    action: "one"
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save"
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove"
}, 

    // Auth
{
    method: "post",
    route: "/login",
    controller: AuthController,
    action: "login"
},
{
    method: "post",
    route: "/signup",
    controller: AuthController,
    action: "signup"
},

    // Status
/*{
    method: "get",
    route: "/status",
    controller: StatusController,
    action: "all"
},*/
{
    method: "get",
    route: "/status",
    controller: StatusController,
    action: "one"
}, {
    method: "post",
    route: "/status",
    controller: StatusController,
    action: "save"
}, {
    method: "delete",
    route: "/status/:id",
    controller: StatusController,
    action: "remove"
}, {
    method: "post",
    route: "/update_status",
    controller: StatusController,
    action: "update"
}, {
    method: "post",
    route: "/create_update_status",
    controller: StatusController,
    action: "create_update"
},

    // Employee
{
    method: "get",
    route: "/employee",
    controller: EmployeeController,
    action: "one"
}, {
    method: "post",
    route: "/employee",
    controller: EmployeeController,
    action: "save"
}, {
    method: "delete",
    route: "/employee/:id",
    controller: EmployeeController,
    action: "remove"
}, {
    method: "post",
    route: "/update_employee",
    controller: EmployeeController,
    action: "update"
}, {
    method: "post",
    route: "/create_update_employee",
    controller: EmployeeController,
    action: "create_update"
},

    // Position
{
    method: "get",
    route: "/position",
    controller: PositionController,
    action: "one"
}, {
    method: "post",
    route: "/position",
    controller: PositionController,
    action: "save"
}, {
    method: "delete",
    route: "/position/:id",
    controller: PositionController,
    action: "remove"
}, {
    method: "post",
    route: "/update_position",
    controller: PositionController,
    action: "update"
}, {
    method: "post",
    route: "/create_update_position",
    controller: PositionController,
    action: "create_update"
},

    // Supplier
{
    method: "get",
    route: "/supplier",
    controller: SupplierController,
    action: "one"
}, {
    method: "post",
    route: "/supplier",
    controller: SupplierController,
    action: "save"
}, {
    method: "delete",
    route: "/supplier/:id",
    controller: SupplierController,
    action: "remove"
}, {
    method: "post",
    route: "/update_supplier",
    controller: SupplierController,
    action: "update"
}, {
    method: "post",
    route: "/create_update_supplier",
    controller: SupplierController,
    action: "create_update"
},

    // Category
{
    method: "get",
    route: "/category",
    controller: CategoryController,
    action: "one"
}, {
    method: "post",
    route: "/category",
    controller: CategoryController,
    action: "save"
}, {
    method: "delete",
    route: "/category/:id",
    controller: CategoryController,
    action: "remove"
}, {
    method: "post",
    route: "/update_category",
    controller: CategoryController,
    action: "update"
}, {
    method: "post",
    route: "/create_update_category",
    controller: CategoryController,
    action: "create_update"
},

    // Item
{
    method: "get",
    route: "/item",
    controller: ItemController,
    action: "one"
}, {
    method: "post",
    route: "/item",
    controller: ItemController,
    action: "save"
}, {
    method: "delete",
    route: "/item/:id",
    controller: ItemController,
    action: "remove"
}, {
    method: "post",
    route: "/update_item",
    controller: ItemController,
    action: "update"
}, {
    method: "post",
    route: "/create_update_item",
    controller: ItemController,
    action: "create_update"
},

    // ItemMappingSupplier
{
    method: "get",
    route: "/item_mapping_supplier",
    controller: ItemMappingSupplierController,
    action: "one"
}, {
    method: "post",
    route: "/item_mapping_supplier",
    controller: ItemMappingSupplierController,
    action: "save"
}, {
    method: "delete",
    route: "/item_mapping_supplier/:id",
    controller: ItemMappingSupplierController,
    action: "remove"
}, {
    method: "post",
    route: "/update_item_mapping_supplier",
    controller: ItemMappingSupplierController,
    action: "update"
}, {
    method: "post",
    route: "/create_update_item_mapping_supplier",
    controller: ItemMappingSupplierController,
    action: "create_update"
}, {
    method: "post",
    route: "/export_item_mapping_supplier",
    controller: ItemMappingSupplierController,
    action: "export"
},

    // PO_Request
{
    method: "get",
    route: "/po_request",
    controller: PO_RequestController,
    action: "one"
}, {
    method: "post",
    route: "/po_request",
    controller: PO_RequestController,
    action: "save"
}, {
    method: "delete",
    route: "/po_request/:id",
    controller: PO_RequestController,
    action: "remove"
}, {
    method: "post",
    route: "/update_po_request",
    controller: PO_RequestController,
    action: "update"
}, {
    method: "post",
    route: "/create_update_po_request",
    controller: PO_RequestController,
    action: "create_update"
},{
    method: "post",
    route: "/export_po_request",
    controller: PO_RequestController,
    action: "export"
},{
    method: "post",
    route: "/send_email_po_request",
    controller: PO_RequestController,
    action: "sendEmail"
},

    // PO_Item
{
    method: "get",
    route: "/po_item",
    controller: PO_ItemController,
    action: "one"
}, {
    method: "post",
    route: "/po_item",
    controller: PO_ItemController,
    action: "save"
}, {
    method: "delete",
    route: "/po_item/:id",
    controller: PO_ItemController,
    action: "remove"
}, {
    method: "post",
    route: "/update_po_item",
    controller: PO_ItemController,
    action: "update"
}, {
    method: "post",
    route: "/create_update_po_item",
    controller: PO_ItemController,
    action: "create_update"
}

]