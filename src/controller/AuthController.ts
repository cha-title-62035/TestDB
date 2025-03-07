import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User"
// import { UserController } from "./UserController"
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt"

export class AuthController{

    private userRepository = AppDataSource.getRepository(User)

    async login(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body
        if(!(email && password)){
            res.status(403).json({ message: "Invalid Credentials" });
        }
        // const hashedPassword = await bcrypt.hash(password, 10)
        const check_user = await this.userRepository.findOne({
            where: { email: email }
        });

        if(!check_user)
        {
            res.status(403).json({ message: "Invalid Credentials" });
        }

        const IsPasswordValid = await bcrypt.compare(password, check_user.password);

        if(IsPasswordValid){
            const token = jwt.sign({user: check_user}, "TestDB", {expiresIn: "1h"});
            let obj = {
                //user: check_user,
                token: token,
                //message: "login successfully"
            }
            return obj
        }
        else{
            return res.status(403).json({
                user: null,
                token: null,
                message: "login failed"
            });
        }
    }

    async signup(req: Request, res: Response, next: NextFunction) {
        const { email, password, age } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = Object.assign(new User(), {
            email,
            password,
            age
        })

        user.password = hashedPassword

        return this.userRepository.save(user)
    }


}