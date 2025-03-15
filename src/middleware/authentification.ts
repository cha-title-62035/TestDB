import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
dotenv.config();

export const authentification = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  console.log("authen");
  if (!header) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  if (!decode) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  // const { id, email, password, age } = JSON.parse(decode)
  // const user = Object.assign(new User(), {
  //             decode
  //         })
  // AppDataSource.manager.findOne({
  //   where: { user.id }
  // })
  // console.log(decode);
  // console.log(req[" currentUser"]);
  req[" currentUser"] = decode;
  // console.log(req[" currentUser"]);
  next();
};