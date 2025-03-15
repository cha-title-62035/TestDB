import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { PO_Request } from "../entity/PO_Request"

export class PO_RequestController {

    private PO_RequestRepository = AppDataSource.getRepository(PO_Request)

    async all(request: Request, response: Response, next: NextFunction) {
        return await this.PO_RequestRepository.createQueryBuilder("PO_Request")
        .leftJoinAndSelect("PO_Request.Supplier", "Supplier.Code, Supplier.Name")
        .getRawMany();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const Rawurl = request.url;
        const url = Rawurl.replace("/po_request", "");

        if(url == ""){
            return await this.PO_RequestRepository.createQueryBuilder("PO_Request")
            .select("Supplier")
            .leftJoin("PO_Request.Supplier", "Supplier")
            .getMany();
        }

        const urlParams = new URLSearchParams(url);
        
        if (urlParams.getAll.length == 0){
            return "Invalid URL"
        }
        const PR_Id = parseInt(urlParams.get("id"));


        const PO_Request = await this.PO_RequestRepository.findOne({
            where: { PR_Id }
        })

        if (!PO_Request) {
            return "unregistered PO_Request"
        }
        return PO_Request
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { PR_SupplierId, PONumber, DueDate, PR_CreateBy, PR_CreateOn, PR_UpdateOn, PR_StatusId, PR_ApproverId, RejectComment } = request.body;

        const po_request = Object.assign(new PO_Request(), {
            PR_SupplierId,
            PONumber,
            DueDate,
            PR_CreateBy,
            PR_CreateOn,
            PR_UpdateOn,
            PR_StatusId,
            PR_ApproverId,
            RejectComment
        })

        return this.PO_RequestRepository.save(po_request)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const PR_Id = parseInt(request.params.id)

        let PO_RequestToRemove = await this.PO_RequestRepository.findOneBy({ PR_Id })

        if (!PO_RequestToRemove) {
            return "this PO_Request not exist"
        }

        await this.PO_RequestRepository.remove(PO_RequestToRemove)

        return "PO_Request has been removed"
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const { PR_Id, PR_SupplierId, PONumber, DueDate, PR_CreateBy, PR_CreateOn, PR_UpdateOn, PR_StatusId, PR_ApproverId, RejectComment } = request.body;

        const po_request = Object.assign(new PO_Request(), {
            PR_Id,
            PR_SupplierId,
            PONumber,
            DueDate,
            PR_CreateBy,
            PR_CreateOn,
            PR_UpdateOn,
            PR_StatusId,
            PR_ApproverId,
            RejectComment
        })

        return await this.PO_RequestRepository.update(parseInt(po_request.PR_Id), po_request)
    }

    async create_update(request: Request, response: Response, next: NextFunction) {
        const { PR_Id, PR_SupplierId, PONumber, DueDate, PR_CreateBy, PR_CreateOn, PR_UpdateOn, PR_StatusId, PR_ApproverId, RejectComment } = request.body;
        const PO_RequestToUpdate = await this.PO_RequestRepository.findOneBy({ PR_Id })
        const po_request = Object.assign(new PO_Request(), {
            PR_Id,
            PR_SupplierId,
            PONumber,
            DueDate,
            PR_CreateBy,
            PR_CreateOn,
            PR_UpdateOn,
            PR_StatusId,
            PR_ApproverId,
            RejectComment
        })

        if (!PO_RequestToUpdate) {
            return this.PO_RequestRepository.save(po_request)
        }
        
        return await this.PO_RequestRepository.update(parseInt(po_request.PR_Id), po_request)
    }

}