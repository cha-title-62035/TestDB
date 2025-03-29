import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { PO_Item_TestDB } from "../entity/PO_Item"

export class PO_ItemController {

    private PO_ItemRepository = AppDataSource.getRepository(PO_Item_TestDB)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.PO_ItemRepository.find()
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const Rawurl = request.url;
        const url = Rawurl.replace("/po_item", "");

        if(url == ""){
            return this.PO_ItemRepository.find()
        }

        const urlParams = new URLSearchParams(url);
        
        if (urlParams.getAll.length == 0){
            return "Invalid URL"
        }
        const PI_Id = parseInt(urlParams.get("id"));


        const PO_Item = await this.PO_ItemRepository.findOne({
            where: { PI_Id }
        })

        if (!PO_Item) {
            return "unregistered PO_Item"
        }
        return PO_Item
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { PI_PORequestId, PI_ItemId, Qty, Amount, Comment } = request.body;

        const po_item = Object.assign(new PO_Item_TestDB(), {
            PI_PORequestId,
            PI_ItemId,
            Qty,
            Amount,
            Comment
        })

        return this.PO_ItemRepository.save(po_item)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const PI_Id = parseInt(request.params.id)

        let PO_ItemToRemove = await this.PO_ItemRepository.findOneBy({ PI_Id })

        if (!PO_ItemToRemove) {
            return "this PO_Item not exist"
        }

        await this.PO_ItemRepository.remove(PO_ItemToRemove)

        return "PO_Item has been removed"
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const { PI_Id, PI_PORequestId, PI_ItemId, Qty, Amount, Comment } = request.body;

        const po_item = Object.assign(new PO_Item_TestDB(), {
            PI_Id,
            PI_PORequestId,
            PI_ItemId,
            Qty,
            Amount,
            Comment
        })

        return await this.PO_ItemRepository.update(parseInt(po_item.PI_Id), po_item)
    }

    async create_update(request: Request, response: Response, next: NextFunction) {
        const { PI_Id, PI_PORequestId, PI_ItemId, Qty, Amount, Comment } = request.body;
        const PO_ItemToUpdate = await this.PO_ItemRepository.findOneBy({ PI_Id })
        const po_item = Object.assign(new PO_Item_TestDB(), {
            PI_Id,
            PI_PORequestId,
            PI_ItemId,
            Qty,
            Amount,
            Comment
        })

        if (!PO_ItemToUpdate) {
            return this.PO_ItemRepository.save(po_item)
        }
        
        return await this.PO_ItemRepository.update(parseInt(po_item.PI_Id), po_item)
    }

}