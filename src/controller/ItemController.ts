import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Item } from "../entity/Item"

export class ItemController {

    private ItemRepository = AppDataSource.getRepository(Item)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.ItemRepository.find()
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const Rawurl = request.url;
        const url = Rawurl.replace("/item", "");

        if(url == ""){
            // return this.ItemRepository.find()
            return await this.ItemRepository.createQueryBuilder("Item")
            .leftJoinAndSelect("Item.Employee_CreateBy", "CreateBy")
            .leftJoinAndSelect("Item.Employee_UpdateBy", "UpdateBy")
            .getMany();
        }

        const urlParams = new URLSearchParams(url);
        
        if (urlParams.getAll.length == 0){
            return response.status(400).json({ message: "Invalid URL" });
        }
        const I_Id = parseInt(urlParams.get("id"));


        const Item = await this.ItemRepository.findOne({
            where: { I_Id }
        })

        if (!Item) {
            return response.status(400).json({ message: "unregistered Item" });
        }
        return Item
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { Code, Name, I_CategoryId, Price, Unit, IsActive, I_CreateBy, I_CreateOn, I_UpdateBy, I_UpdateOn } = request.body;

        const item = Object.assign(new Item(), {
            Code,
            Name,
            I_CategoryId,
            Price,
            Unit,
            IsActive,
            I_CreateBy,
            I_CreateOn,
            I_UpdateBy,
            I_UpdateOn
        })

        return this.ItemRepository.save(item)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const I_Id = parseInt(request.params.id)

        let ItemToRemove = await this.ItemRepository.findOneBy({ I_Id })

        if (!ItemToRemove) {
            return "this Item not exist"
        }

        await this.ItemRepository.remove(ItemToRemove)

        return "Item has been removed"
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const { I_Id, Code, Name, I_CategoryId, Price, Unit, IsActive, I_CreateBy, I_CreateOn, I_UpdateBy, I_UpdateOn } = request.body;

        const item = Object.assign(new Item(), {
            I_Id,
            Code,
            Name,
            I_CategoryId,
            Price,
            Unit,
            IsActive,
            I_CreateBy,
            I_CreateOn,
            I_UpdateBy,
            I_UpdateOn
        })

        return await this.ItemRepository.update(parseInt(item.I_Id), item)
    }

    async create_update(request: Request, response: Response, next: NextFunction) {
        const { I_Id, Code, Name, I_CategoryId, Price, Unit, IsActive, I_CreateBy, I_CreateOn, I_UpdateBy, I_UpdateOn } = request.body;
        const ItemToUpdate = await this.ItemRepository.findOneBy({ I_Id })
        const item = Object.assign(new Item(), {
            I_Id,
            Code,
            Name,
            I_CategoryId,
            Price,
            Unit,
            IsActive,
            I_CreateBy,
            I_CreateOn,
            I_UpdateBy,
            I_UpdateOn
        })

        if (!ItemToUpdate) {
            return this.ItemRepository.save(item)
        }
        
        return await this.ItemRepository.update(parseInt(item.I_Id), item)
    }

}