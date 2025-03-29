import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Status_TestDB } from "../entity/Status"

export class StatusController {

    private StatusRepository = AppDataSource.getRepository(Status_TestDB)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.StatusRepository.find()
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const Rawurl = request.url;
        const url = Rawurl.replace("/status", "");

        if(url == ""){
            return this.StatusRepository.find()
        }

        const urlParams = new URLSearchParams(url);
        
        if (urlParams.getAll.length == 0){
            return "Invalid URL"
        }
        const ST_Id = parseInt(urlParams.get("id"));


        const Status = await this.StatusRepository.findOne({
            where: { ST_Id }
        })

        if (!Status) {
            return "unregistered Status"
        }
        return Status
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { Label, Order, Is_Active } = request.body;

        const status = Object.assign(new Status_TestDB(), {
            Label,
            Order,
            Is_Active
        })

        return this.StatusRepository.save(status)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const ST_Id = parseInt(request.params.id)

        let StatusToRemove = await this.StatusRepository.findOneBy({ ST_Id })

        if (!StatusToRemove) {
            return "this Status not exist"
        }

        await this.StatusRepository.remove(StatusToRemove)

        return "Status has been removed"
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const { ST_Id, Label, Order, Is_Active } = request.body;

        const status = Object.assign(new Status_TestDB(), {
            ST_Id,
            Label,
            Order,
            Is_Active
        })

        return await this.StatusRepository.update(parseInt(status.ST_Id), status)
    }

    async create_update(request: Request, response: Response, next: NextFunction) {
        const { ST_Id, Label, Order, Is_Active } = request.body;
        const StatusToUpdate = await this.StatusRepository.findOneBy({ ST_Id })
        const status = Object.assign(new Status_TestDB(), {
            ST_Id,
            Label,
            Order,
            Is_Active
        })

        if (!StatusToUpdate) {
            return this.StatusRepository.save(status)
        }
        
        return await this.StatusRepository.update(parseInt(status.ST_Id), status)
    }

}