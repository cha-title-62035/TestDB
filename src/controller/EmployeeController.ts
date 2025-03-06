import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { Employee } from "../entity/Employee"

export class EmployeeController {

    private EmployeeRepository = AppDataSource.getRepository(Employee)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.EmployeeRepository.find()
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const Rawurl = request.url;
        const url = Rawurl.replace("/employee", "");

        if(url == ""){
            return await this.EmployeeRepository.createQueryBuilder("Employee")
            .leftJoinAndSelect("Employee.Position", "Position")
            .getRawMany();
        }

        const urlParams = new URLSearchParams(url);
        
        if (urlParams.getAll.length == 0){
            return "Invalid URL"
        }
        const E_Id = parseInt(urlParams.get("id"));


        const Employee = await this.EmployeeRepository.findOne({
            where: { E_Id }
        })

        if (!Employee) {
            return "unregistered Employee"
        }
        return Employee
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { EmployeeCode, E_PositionId } = request.body;

        const employee = Object.assign(new Employee(), {
            EmployeeCode,
            E_PositionId
        })

        return this.EmployeeRepository.save(employee)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const E_Id = parseInt(request.params.id)

        let EmployeeToRemove = await this.EmployeeRepository.findOneBy({ E_Id })

        if (!EmployeeToRemove) {
            return "this Employee not exist"
        }

        await this.EmployeeRepository.remove(EmployeeToRemove)

        return "Employee has been removed"
    }

    async update(request: Request, response: Response, next: NextFunction) {
        const { E_Id, EmployeeCode, E_PositionId } = request.body;

        const employee = Object.assign(new Employee(), {
            E_Id,
            EmployeeCode,
            E_PositionId
        })

        return await this.EmployeeRepository.update(parseInt(E_Id), employee)
    }

    async create_update(request: Request, response: Response, next: NextFunction) {
        const { E_Id, Label, Order, Is_Active } = request.body;
        const EmployeeToUpdate = await this.EmployeeRepository.findOneBy({ E_Id })
        const employee = Object.assign(new Employee(), {
                E_Id,
                Label,
                Order,
                Is_Active
            })

        if (!EmployeeToUpdate) {
            return this.EmployeeRepository.save(employee)
        }
        
        return await this.EmployeeRepository.update(parseInt(employee.E_Id), employee)
    }

}