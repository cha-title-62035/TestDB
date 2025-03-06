import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Supplier } from "../entity/Supplier"

export class SupplierController {

    private SupplierRepository = AppDataSource.getRepository(Supplier)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.SupplierRepository.find()
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const Rawurl = request.url;
        const url = Rawurl.replace("/supplier", "");

        if(url == ""){
            return this.SupplierRepository.find()
        }

        const urlParams = new URLSearchParams(url);
        
        if (urlParams.getAll.length == 0){
            return "Invalid URL"
        }
        const S_Id = parseInt(urlParams.get("id"));


        const Supplier = await this.SupplierRepository.findOne({
            where: { S_Id }
        })

        if (!Supplier) {
            return "unregistered Supplier"
        }
        return Supplier
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { Code, Name, IsActive, CreateOn, CreateBy, UpdateBy, UpdateOn } = request.body;

        const supplier = Object.assign(new Supplier(), {
            Code,
            Name,
            IsActive,
            CreateOn,
            CreateBy,
            UpdateBy,
            UpdateOn
        })

        return this.SupplierRepository.save(supplier)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const S_Id = parseInt(request.params.id)

        let SupplierToRemove = await this.SupplierRepository.findOneBy({ S_Id })

        if (!SupplierToRemove) {
            return "this Supplier not exist"
        }

        await this.SupplierRepository.remove(SupplierToRemove)

        return "Supplier has been removed"
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const { S_Id, Code, Name, IsActive, CreateOn, CreateBy, UpdateBy, UpdateOn } = request.body;

        const supplier = Object.assign(new Supplier(), {
            S_Id,
            Code,
            Name,
            IsActive,
            CreateOn,
            CreateBy,
            UpdateBy,
            UpdateOn
        })

        return await this.SupplierRepository.update(parseInt(supplier.S_Id), supplier)
    }

    async create_update(request: Request, response: Response, next: NextFunction) {
        const { S_Id, Code, Name, IsActive, CreateOn, CreateBy, UpdateBy, UpdateOn } = request.body;
        const SupplierToUpdate = await this.SupplierRepository.findOneBy({ S_Id })
        const supplier = Object.assign(new Supplier(), {
            S_Id,
            Code,
            Name,
            IsActive,
            CreateOn,
            CreateBy,
            UpdateBy,
            UpdateOn
        })

        if (!SupplierToUpdate) {
            return this.SupplierRepository.save(supplier)
        }
        
        return await this.SupplierRepository.update(parseInt(supplier.S_Id), supplier)
    }

}