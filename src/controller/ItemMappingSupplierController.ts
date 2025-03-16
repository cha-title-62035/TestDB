import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { ItemMappingSupplier } from "../entity/ItemMappingSupplier"
import { Item } from "../entity/Item"
import { Supplier } from "../entity/Supplier"

export class ItemMappingSupplierController {

    private ItemMappingSupplierRepository = AppDataSource.getRepository(ItemMappingSupplier)
    private ItemRepository = AppDataSource.getRepository(Item)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.ItemMappingSupplierRepository.find()
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
            return console.log(await AppDataSource.createQueryBuilder()
            .select("Item")
            .addSelect("Supplier")
            .from(ItemMappingSupplier, "Item_Mapping_Supplier")
            .leftJoin("Item_Mapping_Supplier.Item", "Item")
            .leftJoin("Item_Mapping_Supplier.Supplier", "Supplier")
            .getMany())
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
        const IMS_Id = parseInt(urlParams.get("id"));


        const ItemMappingSuppliers = await this.ItemMappingSupplierRepository.findOne({
            where: { IMS_Id }
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

        const item_mapping_supplier = Object.assign(new ItemMappingSupplier(), {
            IMS_ItemId,
            IMS_SupplierId
        })

        return this.ItemMappingSupplierRepository.save(item_mapping_supplier)
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

        const item_mapping_supplier = Object.assign(new ItemMappingSupplier(), {
            IMS_Id,
            IMS_ItemId,
            IMS_SupplierId
        })

        return await this.ItemMappingSupplierRepository.update(parseInt(item_mapping_supplier.IMS_Id), item_mapping_supplier)
    }

    async create_update(request: Request, response: Response, next: NextFunction) {
        const { IMS_Id, IMS_ItemId, IMS_SupplierId } = request.body;
        const ItemMappingSupplierToUpdate = await this.ItemMappingSupplierRepository.findOneBy({ IMS_Id })
        const item_mapping_supplier = Object.assign(new ItemMappingSupplier(), {
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