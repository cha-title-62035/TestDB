import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Position_TestDB } from "../entity/Position"
import { stringify } from "querystring"

export class PositionController {

    private PositionRepository = AppDataSource.getRepository(Position_TestDB)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.PositionRepository.find()
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const Rawurl = request.url;
        const url = Rawurl.replace("/position", "");

        if(url == ""){
            return this.PositionRepository.find()
        }

        const urlParams = new URLSearchParams(url);
        
        if (urlParams.getAll.length == 0){
            return "Invalid URL"
        }
        const P_Id = parseInt(urlParams.get("id"));


        const Position = await this.PositionRepository.findOne({
            where: { P_Id }
        })

        if (!Position) {
            return "unregistered Position"
        }
        return Position
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { Label, Order, Is_Active } = request.body;

        const position = Object.assign(new Position_TestDB(), {
            Label,
            Order,
            Is_Active
        })

        return this.PositionRepository.save(position)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const P_Id = parseInt(request.params.id)

        let PositionToRemove = await this.PositionRepository.findOneBy({ P_Id })

        if (!PositionToRemove) {
            return "this Position not exist"
        }

        await this.PositionRepository.remove(PositionToRemove)

        return "Position has been removed"
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const { P_Id, Label, Order, Is_Active } = request.body;

        const position = Object.assign(new Position_TestDB(), {
            P_Id,
            Label,
            Order,
            Is_Active
        })

        return await this.PositionRepository.update(parseInt(position.P_Id), position)
    }

    async create_update(request: Request, response: Response, next: NextFunction) {
        const { P_Id, Label, Order, Is_Active } = request.body;
        const PositionToUpdate = await this.PositionRepository.findOneBy({ P_Id })
        const position = Object.assign(new Position_TestDB(), {
            P_Id,
            Label,
            Order,
            Is_Active
            })

        if (!PositionToUpdate) {
            return this.PositionRepository.save(position)
        }
        
        return await this.PositionRepository.update(parseInt(position.P_Id), position)
    }

}