import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { ItemMappingSupplier } from "../entity/ItemMappingSupplier"

export class ItemMappingSupplierController {

    private ItemMappingSupplierRepository = AppDataSource.getRepository(ItemMappingSupplier)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.ItemMappingSupplierRepository.find()
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const Rawurl = request.url;
        const url = Rawurl.replace("/item_mapping_supplier", "");

        if(url == ""){
            return this.ItemMappingSupplierRepository.find()
        }

        const urlParams = new URLSearchParams(url);
        
        if (urlParams.getAll.length == 0){
            return "Invalid URL"
        }
        const IMS_Id = parseInt(urlParams.get("id"));


        const ItemMappingSupplier = await this.ItemMappingSupplierRepository.findOne({
            where: { IMS_Id }
        })

        if (!ItemMappingSupplier) {
            return "unregistered Item Mapping Supplier"
        }
        return ItemMappingSupplier
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { IMS_ItemId, IMS_SupplierId } = request.body;

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