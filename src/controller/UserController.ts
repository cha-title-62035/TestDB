import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User_TestDB } from "../entity/User"

export class UserController {

    private userRepository = AppDataSource.getRepository(User_TestDB)

    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find()
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const Rawurl = request.url;
        console.log(Rawurl);
        const url = Rawurl.replace("/users", "");

        if(url == ""){
            return this.userRepository.find()
        }

        const urlParams = new URLSearchParams(url);
        
        if (urlParams.getAll.length == 0){
            return response.status(400).json({ message: "Invalid URL" });
        }
        // console.log(urlParams);
        const id = parseInt(urlParams.get("id"));
        // console.log(id);
        // const id = parseInt(request.params.id)



        const user = await this.userRepository.findOne({
            where: { id }
        })

        if (!user) {
            return "unregistered user"
        }
        return user
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { email, password, age } = request.body;

        const user = Object.assign(new User_TestDB(), {
            email,
            password,
            age
        })

        return this.userRepository.save(user)
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let userToRemove = await this.userRepository.findOneBy({ id })

        if (!userToRemove) {
            return "this user not exist"
        }

        await this.userRepository.remove(userToRemove)

        return "user has been removed"
    }

}