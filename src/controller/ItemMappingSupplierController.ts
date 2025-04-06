import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { ItemMappingSupplier_TestDB } from "../entity/ItemMappingSupplier"
import { Item_TestDB } from "../entity/Item"
import { Supplier_TestDB } from "../entity/Supplier"
import * as Excel from "exceljs"
import * as path from "path"
import { Category_TestDB } from "../entity/Category"
import * as XLSX from "xlsx"
import * as exceltojson from "convert-excel-to-json"
import { Brackets, Equal, ILike } from "typeorm"

export class ItemMappingSupplierController {

    private ItemMappingSupplierRepository = AppDataSource.getRepository(ItemMappingSupplier_TestDB)
    private ItemRepository = AppDataSource.getRepository(Item_TestDB)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.ItemMappingSupplierRepository.find()
    }

    async import(request: Request, response: Response, next: NextFunction) {
        try {
            // const workbook = new Excel.Workbook();
            // await workbook.xlsx.load(request.file.buffer);
            // const worksheet = workbook.getWorksheet("ItemSupplier")
            // // const workbook = XLSX.read(request.file)
            // // const worksheet = workbook.SheetNames;
            

            // if (!worksheet/* || worksheet[0] != "ItemSupplier"*/){
            //     throw new Error("Worksheet not found").message;
            // }
            
            // const data = JSON.stringify(workbook.model)
            // const data = XLSX.utils.sheet_to_json(workbook.Sheets[worksheet[0]])
            // headerRowNumber is the number of the row with the titles counting from 1

            const data = exceltojson({
                source: request.file.buffer,
                header: {
                    rows: 1
                },
                columnToKey: {
                    '*': '{{columnHeader}}'
                }
            });

            if (!data.ItemSupplier) {
                throw new Error("Worksheet not found").message;
            }
            
            console.log(data.ItemSupplier)
            const db: any = []
            data.ItemSupplier.forEach(json_data_set => {
                // console.log(json_data_set)
                // console.log(json_data_set.IMS_ItemId)
                // db.push(json_data_set.IMS_ItemId)
                // db.push(json_data_set.IMS_SupplierId)
                
                let IMS_ItemId = json_data_set.IMS_ItemId
                let IMS_SupplierId = json_data_set.IMS_SupplierId
                // Object.keys(json_data_set).forEach( key =>{
                //     table += "<td>"
                //     table += json_data_set[key] + "</td>";
                //     let IMS_ItemId = 0
                //     let IMS_SupplierId = 0
                // })

                const item_mapping_supplier = Object.assign(new ItemMappingSupplier_TestDB(), {
                    IMS_ItemId,
                    IMS_SupplierId
                })

                // let dt = await this.ItemMappingSupplierRepository.save(item_mapping_supplier);
                AppDataSource.manager.transaction(async transactionalEntityManager => {
                    await this.ItemMappingSupplierRepository.save(item_mapping_supplier)
                })
                
                db.push(item_mapping_supplier)

            });

            return db

            /*worksheet.eachRow((row, rowNumber) => {
                const rowValues
            })*/
        }

        catch(error: any) {
            console.log('ROLLBACK')
            console.error(error);
            throw error
        }
    }


    async export(request: Request, response: Response, next: NextFunction) {
        const workbook = new Excel.Workbook();
        const worksheetSupplier = workbook.addWorksheet("Supplier");
        const worksheetItem = workbook.addWorksheet("Item");
        const SupplierColumns = [
            { key: "Code", header: "Code" },
            { key: "Name", header: "Name" },
            { key: "IsActive", header: "Is Active" }
        ]
        const ItemColumns = [
            { key: "Item_Supplier", header: "Supplier" },
            { key: "Code", header: "Code" },
            { key: "Name", header: "Name" },
            { key: "Category_Label", header: "Category Name" },
            { key: "Price", header: "Price" },
            { key: "Unit", header: "Unit" },
            { key: "IsActive", header: "Is Active" }
        ]
        worksheetSupplier.columns = SupplierColumns;
        worksheetItem.columns = ItemColumns;

        const Rawurl = request.url;
        const url = Rawurl.replace("/item_mapping_supplier", "");

        if(url == ""){
            const db = await AppDataSource.createQueryBuilder()
            .select("Item")
            // .addSelect("Supplier.Code", "Item_Supplier")
            .addSelect("Supplier")
            .addSelect("Item_Mapping_Supplier.IMS_Id")
            .addSelect("Category.Label", "Category_Label")
            .from(ItemMappingSupplier_TestDB, "Item_Mapping_Supplier")
            .leftJoin("Item_Mapping_Supplier.Item", "Item")
            .leftJoin("Item_Mapping_Supplier.Supplier", "Supplier")
            .leftJoin("Item.Category", "Category")
            .orderBy("Supplier.Code", "ASC")
            .addOrderBy("Item.Code", "ASC")
            .getMany()
        
            console.log(db)

            db.forEach((DB) => {
                DB.Item["Item_Supplier"] = DB.Supplier.Code
                DB.Item["Category_Label"] = DB.Item.Category.Label
                console.log(DB.Item)
                console.log(DB.Supplier)
                console.log(DB.Supplier.Code)
                worksheetItem.addRow(DB.Item)
                worksheetSupplier.addRow(DB.Supplier)
            });
        }
        else {
            const urlParams = new URLSearchParams(url);
        
            if (urlParams.getAll.length == 0){
                return "Invalid URL"
            }
            const S_Code = urlParams.get("s_code");
            const I_Code = urlParams.get("i_code");

            const db = await AppDataSource.createQueryBuilder()
            .select("Item")
            // .addSelect("Supplier.Code", "Item_Supplier")
            .addSelect("Supplier")
            .addSelect("Item_Mapping_Supplier.IMS_Id")
            .addSelect("Category.Label", "Category_Label")
            .from(ItemMappingSupplier_TestDB, "Item_Mapping_Supplier")
            .leftJoin("Item_Mapping_Supplier.Item", "Item")
            .leftJoin("Item_Mapping_Supplier.Supplier", "Supplier")
            .leftJoin("Item.Category", "Category")
            .where(
                new Brackets((qb) => {
                    qb.where("Supplier.Code = :S_Code", { S_Code })
                    .orWhere("S_Code = ''", { S_Code })
                })
            )
            .andWhere(
                new Brackets((qb) => {
                    qb.where("Item.Code = :I_Code", { I_Code })
                    .orWhere("I_Code = ''", { I_Code })
                })
            )
            .orderBy("Supplier.Code", "ASC")
            .addOrderBy("Item.Code", "ASC")
            .getMany()
        
            console.log(db)

            db.forEach((DB) => {
                DB.Item["Item_Supplier"] = DB.Supplier.Code
                DB.Item["Category_Label"] = DB.Item.Category.Label
                console.log(DB.Item)
                console.log(DB.Supplier)
                console.log(DB.Supplier.Code)
                worksheetItem.addRow(DB.Item)
                worksheetSupplier.addRow(DB.Supplier)
            });
        }

        function addZero(i) {
            if (i < 10) {
              i = "0" + i;
            }
            return i;
        }
        const d = new Date();
        const timestamptz = addZero(d.getFullYear()) + addZero(d.getMonth()) + addZero(d.getDate())
        + "-" + addZero(d.getHours()) + addZero(d.getMinutes()) + addZero(d.getSeconds());

        const exportPath = path.resolve("./src/files/", "Supplier_Item_" + timestamptz + ".xlsx")
        // await workbook.xlsx.writeFile(exportPath);
        let buffer = await workbook.xlsx.writeBuffer();
        // response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        
        return response.set("Content-Disposition", "attachment; filename=Supplier_Item_" + timestamptz + ".xlsx").send(buffer);
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const Rawurl = request.url;
        const url = Rawurl.replace("/item_mapping_supplier", "");

        if(url == ""){
            // return /*const db =*/ await AppDataSource.manager.query("SELECT IMS.IMS_ItemId FROM item_mapping_supplier IMS LEFT JOIN item ON IMS.Item = item.I_Id")
            // // .innerJoin("Item_Mapping_Supplier.Item", "IMS")
            // // .leftJoinAndSelect("Item_Mapping_Supplier.Supplier", "Supplier")
            // .select("Item")
            // // .addSelect("Supplier")
            // .from(Item, "Item")
            // .leftJoin(ItemMappingSupplier, "IMS", "Item.I_Id = IMS.IMS_ItemId") //, "Item_Mapping_Supplier.IMS_ItemId = Item.I_Id")
            // .leftJoinAndSelect("IMS.Supplier", "Supplier"/*, "Supplier.S_Id = IMS.IMS_SupplierId"*/) //, '"Item_Mapping_Supplier"."IMS_SupplierId" = "Supplier"."S_Id"')
            // .getMany()
            // .getMany()
            return await AppDataSource.createQueryBuilder()
            .select("Item")
            .addSelect("Supplier")
            .addSelect("Item_Mapping_Supplier.IMS_Id")
            .addSelect("Category.Label", "Category_Label")
            .from(ItemMappingSupplier_TestDB, "Item_Mapping_Supplier")
            .leftJoin("Item_Mapping_Supplier.Item", "Item")
            .leftJoin("Item_Mapping_Supplier.Supplier", "Supplier")
            .leftJoin("Item.Category", "Category")
            .getMany()
            // const join = await AppDataSource.createQueryBuilder()
            // .select(["item.*", "supplier.*"])
            // .from("(" + db.getQuery() + ")", "Item_Mapping_Supplier")
            // .setParameters(db.getParameters())
            // .getMany()

            // const db = await AppDataSource.manager.find({
            //     // select: {
            //     //     /*IMS_Id: true,
            //     //     IMS_ItemId: false,
            //     //     IMS_SupplierId: false,*/
            //     //     Item: {
            //     //         I_Id: true
            //     //     },
            //     //     Supplier: {
            //     //         S_Id: true
            //     //     }
            //     // },
            //     relations: {
            //         Item: true,
            //         Supplier: true
            //     }
            // })
            // db.forEach(Db => {
            //     delete Db.IMS_Id
            //     delete Db.IMS_ItemId
            //     delete Db.IMS_SupplierId
            // })
            
            // return db
            // const db = await AppDataSource.query("SELECT Item.*, Supplier.* " + 
            //     "FROM item_mapping_supplier IMS " + 
            //     "LEFT JOIN item Item ON IMS.IMS_ItemId = Item.I_Id " + 
            //     "LEFT JOIN supplier Supplier ON IMS.IMS_SupplierId = Supplier.S_Id")
            // console.log(db)
            // return db
            // return join
            // return await this.ItemMappingSupplierRepository.find()/*query(
            //     'SELECT "Item"."*", "Supplier"."*", "IMS"."*" ' + 
            //     'FROM "item_mapping_supplier" "IMS"' + 
            //     'LEFT JOIN "item" "Item" ON "IMS"."IMS_ItemId" = "Item"."I_Id" ' + 
            //     'LEFT JOIN "supplier" "Supplier" ON "IMS"."IMS_SupplierId" = "Supplier"."S_Id"')*/
        }

        const urlParams = new URLSearchParams(url);
        
        if (urlParams.getAll.length == 0){
            return "Invalid URL"
        }
        const IMS_ItemId = parseInt(urlParams.get("i_id"));
        const IMS_SupplierId = parseInt(urlParams.get("s_id"));

        const ItemMappingSuppliers = await this.ItemMappingSupplierRepository.findOne({
            where: { 
                IMS_ItemId,
                IMS_SupplierId 
             } //ILike("%" + IMS_ItemId + "%") }]
        })

        if (!ItemMappingSuppliers) {
            return "unregistered Item Mapping Supplier"
        }
        return ItemMappingSuppliers
    }

    async save(request: Request, response: Response, next: NextFunction) {
        // console.log(request.body);
        const { Item : { I_Id }, Supplier : { S_Id } } = request.body;
        // console.log(I_Id + " " + S_Id);

        const IMS_ItemId = I_Id
        const IMS_SupplierId = S_Id

        const item_mapping_supplier = Object.assign(new ItemMappingSupplier_TestDB(), {
            IMS_ItemId,
            IMS_SupplierId
        })

        return await this.ItemMappingSupplierRepository.save(item_mapping_supplier)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const IMS_Id = parseInt(request.params.id)

        let ItemMappingSupplierToRemove = await this.ItemMappingSupplierRepository.findOneBy({ IMS_Id })

        if (!ItemMappingSupplierToRemove) {
            return "this Item Mapping Supplier not exist"
        }

        await this.ItemMappingSupplierRepository.remove(ItemMappingSupplierToRemove)

        return "Item Mapping Supplier has been removed"
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const { IMS_Id, IMS_ItemId, IMS_SupplierId } = request.body;

        const item_mapping_supplier = Object.assign(new ItemMappingSupplier_TestDB(), {
            IMS_Id,
            IMS_ItemId,
            IMS_SupplierId
        })

        return await this.ItemMappingSupplierRepository.update(parseInt(item_mapping_supplier.IMS_Id), item_mapping_supplier)
    }

    async create_update(request: Request, response: Response, next: NextFunction) {
        const { IMS_Id, IMS_ItemId, IMS_SupplierId } = request.body;
        const ItemMappingSupplierToUpdate = await this.ItemMappingSupplierRepository.findOneBy({ IMS_Id })
        const item_mapping_supplier = Object.assign(new ItemMappingSupplier_TestDB(), {
            IMS_Id,
            IMS_ItemId,
            IMS_SupplierId
        })

        if (!ItemMappingSupplierToUpdate) {
            return this.ItemMappingSupplierRepository.save(item_mapping_supplier)
        }
        
        return await this.ItemMappingSupplierRepository.update(parseInt(item_mapping_supplier.IMS_Id), item_mapping_supplier)
    }

}