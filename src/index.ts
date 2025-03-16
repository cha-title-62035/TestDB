import * as express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import { User } from "./entity/User"
import { authentification } from "./middleware/authentification"
import * as nodemailer from "nodemailer"
import * as dotenv from "dotenv"

AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.json())
    app.use(express.json());
    dotenv.config()

    // app.post('/deliver', async (req: Request, res: Response) => {
        
    // })

    // register express routes from defined application routes
    Routes.forEach(route => {
        if (route.route == "/login") {
            (app as any)[route.method](route.route/*, authentification*/,(req: Request, res: Response, next: Function) => {
                // const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
                // if (!token) {
                //     res.status(401).json({ message: "Missing Token" });
                // }
    
                // try {
                //     const decoded = 
                // }
                const result = (new (route.controller as any))[route.action](req, res, next)
                if (result instanceof Promise) {
                    result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)
    
                } else if (result !== null && result !== undefined) {
                    res.json(result)
                }
            })
        }
        else {
            (app as any)[route.method](route.route, authentification,(req: Request, res: Response, next: Function) => {
                // const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
                // if (!token) {
                //     res.status(401).json({ message: "Missing Token" });
                // }
    
                // try {
                //     const decoded = 
                // }
                const result = (new (route.controller as any))[route.action](req, res, next)
                if (result instanceof Promise) {
                    result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)
    
                } else if (result !== null && result !== undefined) {
                    res.json(result)
                }
            })
        }
        
    })

    // setup express app here
    // ...

    // start express server
    app.listen(3000)

    // insert new users for test
    // await AppDataSource.manager.save(
    //     AppDataSource.manager.create(User, {
    //         firstName: "Timber",
    //         lastName: "Saw",
    //         age: 27
    //     })
    // )

    // await AppDataSource.manager.save(
    //     AppDataSource.manager.create(User, {
    //         firstName: "Phantom",
    //         lastName: "Assassin",
    //         age: 24
    //     })
    // )

    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results")

}).catch(error => console.log(error))
