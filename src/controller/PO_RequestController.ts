import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { PO_Request_TestDB } from "../entity/PO_Request"
import * as Excel from "exceljs"
import * as path from "path"
import { createEmail } from "../email/template"
import * as nodemailer from "nodemailer"
import * as dotenv from "dotenv"
// import * as exceltojson from "convert-excel-to-json"
import { Brackets, IsNull } from "typeorm"
import excelToJson = require("convert-excel-to-json")
import * as moment from "moment-timezone"

export class PO_RequestController {

    private PO_RequestRepository = AppDataSource.getRepository(PO_Request_TestDB)

    async all(request: Request, response: Response, next: NextFunction) {
        return await this.PO_RequestRepository.createQueryBuilder("PO_Request")
        .leftJoinAndSelect("PO_Request.Supplier", "Supplier.Code, Supplier.Name")
        .getRawMany();
    }

    async import(request: Request, response: Response, next: NextFunction) {
        try {
            // const workbook = new Excel.Workbook();
            // await workbook.xlsx.load(request.file.buffer);
            // const worksheet = workbook.getWorksheet("ItemSupplier")
            // // const workbook = XLSX.read(request.file)
            // // const worksheet = workbook.SheetNames;
            

            // if (!worksheet/* || worksheet[0] != "ItemSupplier"*/){
            //     throw new Error("Worksheet not found").message;
            // }
            
            // const data = JSON.stringify(workbook.model)
            // const data = XLSX.utils.sheet_to_json(workbook.Sheets[worksheet[0]])
            // headerRowNumber is the number of the row with the titles counting from 1

            const data = excelToJson({
                source: request.file.buffer,
                header: {
                    rows: 1
                },
                columnToKey: {
                    '*': '{{columnHeader}}'
                }
            });

            if (!data.PO_Request) {
                throw new Error("Worksheet not found").message;
            }
            
            console.log(data.PO_Request)
            const db: any = []
            data.PO_Request.forEach(json_data_set => {
                // console.log(json_data_set)
                // console.log(json_data_set.IMS_ItemId)
                // db.push(json_data_set.IMS_ItemId)
                // db.push(json_data_set.IMS_SupplierId)
                
                // let IMS_ItemId = json_data_set.IMS_ItemId
                // let IMS_SupplierId = json_data_set.IMS_SupplierId
                let { PR_SupplierId,
                PONumber,
                DueDate,
                PR_CreateBy,
                PR_CreateOn,
                PR_UpdateOn,
                PR_StatusId,
                PR_ApproverId,
                RejectComment } = json_data_set
                // Object.keys(json_data_set).forEach( key =>{
                //     table += "<td>"
                //     table += json_data_set[key] + "</td>";
                //     let IMS_ItemId = 0
                //     let IMS_SupplierId = 0
                // })

                const po_request = Object.assign(new PO_Request_TestDB(), {
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
                console.log(moment.tz.zonesForCountry("TH"))
                po_request.DueDate = moment.tz(po_request.DueDate, "Asia/Bangkok").format()
                po_request.PR_CreateOn = moment.tz(po_request.PR_CreateOn, "Asia/Bangkok").format()
                po_request.PR_UpdateOn = moment.tz(po_request.PR_UpdateOn, "Asia/Bangkok").format()

                // let dt = await this.ItemMappingSupplierRepository.save(item_mapping_supplier);
                AppDataSource.manager.transaction(async transactionalEntityManager => {
                    await this.PO_RequestRepository.save(po_request)
                })
                
                db.push(po_request)

            });

            return db

            /*worksheet.eachRow((row, rowNumber) => {
                const rowValues
            })*/
        }

        catch(error: any) {
            console.log('ROLLBACK')
            console.error(error);
            throw error
        }
    }

    async export(request: Request, response: Response, next: NextFunction) {
        const workbook = new Excel.Workbook();
        const filename = "./src/template/Request.xlsx"
        await workbook.xlsx.readFile(filename)
        const worksheet = workbook.getWorksheet(1);
        console.log(workbook)
        console.log(worksheet)
        const RequestColumns = [
            { key: "PO_Request_PONumber" },
            { key: "Supplier_Code" },
            { key: "Supplier_Name" },
            { key: "PO_Request_DueDate" },
            { key: "PO_Request_RejectComment" },
            { key: "sumAmount" },
            { key: "CreateBy_EmployeeCode" },
            { key: "Approver_EmployeeCode" },
            { key: "Status_Label" },
            { key: "PO_Request_PR_UpdateOn" }
        ]
        var counter = 1
        RequestColumns.forEach(column => {
            const Col = worksheet.getColumn(counter);
            Col.key = column.key;
            counter ++;
        });

        const Rawurl = request.url;
        const url = Rawurl.replace("/item_mapping_supplier", "");

        if(url == ""){
            const db = await this.PO_RequestRepository.createQueryBuilder("PO_Request")
            .select("PO_Request.PR_Id")
            .addSelect("PO_Request.PONumber")
            .addSelect(["Supplier.Code", "Supplier.Name"])
            .addSelect("PO_Request.DueDate")
            .addSelect("CreateBy.EmployeeCode")
            .addSelect("Status.Label")
            .addSelect("Approver.EmployeeCode")
            .addSelect("PO_Request.RejectComment")
            .addSelect("SUM(PO_Item.Amount)", "sumAmount")
            .addSelect("PO_Request.PR_UpdateOn")
            .groupBy("PO_Request.PR_Id")
            .addGroupBy("PO_Request.PONumber")
            .addGroupBy("Supplier.Code")
            .addGroupBy("Supplier.Name")
            .addGroupBy("PO_Request.DueDate")
            .addGroupBy("CreateBy.EmployeeCode")
            .addGroupBy("Status.Label")
            .addGroupBy("Approver.EmployeeCode")
            .addGroupBy("PO_Request.RejectComment")
            .addGroupBy("PO_Request.PR_UpdateOn")
            .leftJoin("PO_Request.Supplier", "Supplier")
            .leftJoin("PO_Request.Employee_CreateBy", "CreateBy")
            .leftJoin("PO_Request.Status", "Status")
            .leftJoin("PO_Request.Employee_ApproverId", "Approver")
            .leftJoin("PO_Request.PO_Item", "PO_Item")
            .getRawMany();
        
            console.log(db)

            // worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            //     console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
            // });
            // worksheet.addRows(db)
            var counter = 2;
            db.forEach((DB) => {
                worksheet.getRow(counter).values = DB
                counter ++
            //     DB.Item["Item_Supplier"] = DB.Supplier.Code
            //     DB.Item["Category_Label"] = DB.Item.Category.Label
            //     console.log(DB.Item)
            //     console.log(DB.Supplier)
            //     console.log(DB.Supplier.Code)
            //     worksheetItem.addRow(DB.Item)
            //     worksheetSupplier.addRow(DB.Supplier)
            });
        }
        else {
            const urlParams = new URLSearchParams(url);
        
            if (urlParams.getAll.length == 0){
                return "Invalid URL"
            }
            let PR_Id = parseInt(urlParams.get("id"));
            if (!parseInt(urlParams.get("id"))){
                PR_Id = 0
            }
            let PONumber = urlParams.get("po_number");
            if (!urlParams.get("po_number")){
                PONumber = ""
            }
            let Supplier_Code = urlParams.get("supplier_code");
            if (!urlParams.get("supplier_code")){
                Supplier_Code = ""
            }
            let Supplier_Name = urlParams.get("supplier_name");
            if (!urlParams.get("supplier_name")){
                Supplier_Name = ""
            }
            let DueDate_Start = urlParams.get("duedate_start");
            if (!urlParams.get("duedate_start")){
                DueDate_Start = null
            }
            let DueDate_End = urlParams.get("duedate_end");
            if (!urlParams.get("duedate_end")){
                DueDate_End = null
            }
            let Status_Label = urlParams.get("status_label");
            if (!urlParams.get("status_label")){
                Status_Label = ""
            }
            let Approver_EmployeeCode = urlParams.get("approver");
            if (!urlParams.get("approver")){
                Approver_EmployeeCode = ""
            }
            let RejectComment = urlParams.get("reject_comment");
            if (!urlParams.get("reject_comment")){
                RejectComment = ""
            }

            const db = await this.PO_RequestRepository.createQueryBuilder("PO_Request")
            .select("PO_Request.PR_Id")
            .addSelect("PO_Request.PONumber")
            .addSelect(["Supplier.Code", "Supplier.Name"])
            .addSelect("PO_Request.DueDate")
            .addSelect("CreateBy.EmployeeCode")
            .addSelect("Status.Label")
            .addSelect("Approver.EmployeeCode")
            .addSelect("PO_Request.RejectComment")
            .addSelect("SUM(PO_Item.Amount)", "sumAmount")
            .addSelect("PO_Request.PR_UpdateOn")
            .groupBy("PO_Request.PR_Id")
            .addGroupBy("PO_Request.PONumber")
            .addGroupBy("Supplier.Code")
            .addGroupBy("Supplier.Name")
            .addGroupBy("PO_Request.DueDate")
            .addGroupBy("CreateBy.EmployeeCode")
            .addGroupBy("Status.Label")
            .addGroupBy("Approver.EmployeeCode")
            .addGroupBy("PO_Request.RejectComment")
            .addGroupBy("PO_Request.PR_UpdateOn")
            .where(
                new Brackets((qb) => {
                    qb.where("PO_Request.PR_Id = :PR_Id", { PR_Id })
                    .orWhere(":PR_Id = 0", { PR_Id })
                })
            )
            .andWhere(
                new Brackets((qb) => {
                    qb.where("PO_Request.PONumber = :PONumber", { PONumber })
                    .orWhere(":PONumber = ''", { PONumber })
                })
            )
            .andWhere(
                new Brackets((qb) => {
                    qb.where("Supplier.Code = :Supplier_Code", { Supplier_Code })
                    .orWhere(":Supplier_Code = ''", { Supplier_Code })
                })
            )
            .andWhere(
                new Brackets((qb) => {
                    qb.where("Supplier.Name = :Supplier_Name", { Supplier_Name })
                    .orWhere(":Supplier_Name = ''", { Supplier_Name })
                })
            )
            .andWhere(
                new Brackets((qb) => {
                    qb.where("PO_Request.DueDate >= :DueDate_Start", { DueDate_Start })
                    .orWhere(":DueDate_Start is null", { DueDate_Start })
                })
            )
            .andWhere(
                new Brackets((qb) => {
                    qb.where("PO_Request.DueDate <= :DueDate_End", { DueDate_End })
                    .orWhere(":DueDate_End is null", { DueDate_End })
                })
            )
            .andWhere(
                new Brackets((qb) => {
                    qb.where("Status.Label = :Status_Label", { Status_Label })
                    .orWhere(":Status_Label = ''", { Status_Label })
                })
            )
            .andWhere(
                new Brackets((qb) => {
                    qb.where("Approver.EmployeeCode = :Approver_EmployeeCode", { Approver_EmployeeCode })
                    .orWhere(":Approver_EmployeeCode = ''", { Approver_EmployeeCode })
                })
            )
            .andWhere(
                new Brackets((qb) => {
                    qb.where("PO_Request.RejectComment = :RejectComment", { RejectComment })
                    .orWhere(":RejectComment = ''", { RejectComment })
                })
            )
            .leftJoin("PO_Request.Supplier", "Supplier")
            .leftJoin("PO_Request.Employee_CreateBy", "CreateBy")
            .leftJoin("PO_Request.Status", "Status")
            .leftJoin("PO_Request.Employee_ApproverId", "Approver")
            .leftJoin("PO_Request.PO_Item", "PO_Item")
            .getRawMany();
        
            console.log(db)

            // worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
            //     console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
            // });
            // worksheet.addRows(db)
            var counter = 2;
            db.forEach((DB) => {
                worksheet.getRow(counter).values = DB
                counter ++
            //     DB.Item["Item_Supplier"] = DB.Supplier.Code
            //     DB.Item["Category_Label"] = DB.Item.Category.Label
            //     console.log(DB.Item)
            //     console.log(DB.Supplier)
            //     console.log(DB.Supplier.Code)
            //     worksheetItem.addRow(DB.Item)
            //     worksheetSupplier.addRow(DB.Supplier)
            });
        }

        function addZero(i) {
            if (i < 10) {
              i = "0" + i;
            }
            return i;
        }
        const d = new Date();
        const timestamptz = addZero(d.getFullYear()) + addZero(d.getMonth()) + addZero(d.getDate())
        + "-" + addZero(d.getHours()) + addZero(d.getMinutes()) + addZero(d.getSeconds());

        const exportPath = path.resolve("./src/files/", "PO_Request_" + timestamptz + ".xlsx")
        await workbook.xlsx.writeFile(exportPath);
        return "Finished"
    }

    async sendEmail(request: Request, response: Response, next: NextFunction) {
        let {recipient, subject } = request.body;
        dotenv.config();
        const transporter = nodemailer.createTransport({
            service: "gmail",
            // host: "smtp.ethereal.email",
            // port: 587,
            // secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
        });

        const db = await this.PO_RequestRepository.createQueryBuilder("PO_Request")
        .select("PO_Request.PR_Id")
        .addSelect("PO_Request.PONumber")
        .addSelect(["Supplier.Code", "Supplier.Name"])
        .addSelect("PO_Request.DueDate")
        .addSelect("CreateBy.EmployeeCode")
        .addSelect("Status.Label")
        .addSelect("Approver.EmployeeCode")
        .addSelect("PO_Request.RejectComment")
        .addSelect("SUM(PO_Item.Amount)", "sumAmount")
        .addSelect("PO_Request.PR_UpdateOn")
        .groupBy("PO_Request.PR_Id")
        .addGroupBy("PO_Request.PONumber")
        .addGroupBy("Supplier.Code")
        .addGroupBy("Supplier.Name")
        .addGroupBy("PO_Request.DueDate")
        .addGroupBy("CreateBy.EmployeeCode")
        .addGroupBy("Status.Label")
        .addGroupBy("Approver.EmployeeCode")
        .addGroupBy("PO_Request.RejectComment")
        .addGroupBy("PO_Request.PR_UpdateOn")
        .leftJoin("PO_Request.Supplier", "Supplier")
        .leftJoin("PO_Request.Employee_CreateBy", "CreateBy")
        .leftJoin("PO_Request.Status", "Status")
        .leftJoin("PO_Request.Employee_ApproverId", "Approver")
        .leftJoin("PO_Request.PO_Item", "PO_Item")
        .getRawMany();
            
        const info = await transporter.sendMail({
            from: process.env.EMAIL, 
            to: recipient,
            subject: subject, 
            html: createEmail(db)
        });
        
        console.log("Message sent: %s", info.messageId);
    
        response.status(200).send("Message sent")
    }

    async one(request: Request, response: Response, next: NextFunction) {
        const Rawurl = request.url;
        const url = Rawurl.replace("/po_request", "");

        if(url == ""){
            return await this.PO_RequestRepository.createQueryBuilder("PO_Request")
            .select("PO_Request.PR_Id")
            .addSelect("PO_Request.PONumber")
            .addSelect("Supplier.Code")
            .addSelect("Supplier.Name")
            .addSelect("PO_Request.DueDate")
            .addSelect("CreateBy.EmployeeCode")
            .addSelect("Status.Label")
            .addSelect("Approver.EmployeeCode")
            .addSelect("PO_Request.RejectComment")
            .addSelect("SUM(PO_Item.Amount)", "sumAmount")
            .addSelect("PO_Request.PR_UpdateOn")
            .groupBy("PO_Request.PR_Id")
            .addGroupBy("PO_Request.PONumber")
            .addGroupBy("Supplier.Code")
            .addGroupBy("Supplier.Name")
            .addGroupBy("PO_Request.DueDate")
            .addGroupBy("CreateBy.EmployeeCode")
            .addGroupBy("Status.Label")
            .addGroupBy("Approver.EmployeeCode")
            .addGroupBy("PO_Request.RejectComment")
            .addGroupBy("PO_Request.PR_UpdateOn")
            .leftJoin("PO_Request.Supplier", "Supplier")
            .leftJoin("PO_Request.Employee_CreateBy", "CreateBy")
            .leftJoin("PO_Request.Status", "Status")
            .leftJoin("PO_Request.Employee_ApproverId", "Approver")
            .leftJoin("PO_Request.PO_Item", "PO_Item")
            .getRawMany();
        }

        const urlParams = new URLSearchParams(url);
        
        if (urlParams.getAll.length == 0){
            return "Invalid URL"
        }
        let PR_Id = parseInt(urlParams.get("id"));
        if (!parseInt(urlParams.get("id"))){
            PR_Id = 0
        }
        let PONumber = urlParams.get("po_number");
        if (!urlParams.get("po_number")){
            PONumber = ""
        }
        let Supplier_Code = urlParams.get("supplier_code");
        if (!urlParams.get("supplier_code")){
            Supplier_Code = ""
        }
        let Supplier_Name = urlParams.get("supplier_name");
        if (!urlParams.get("supplier_name")){
            Supplier_Name = ""
        }
        let DueDate_Start = urlParams.get("duedate_start");
        if (!urlParams.get("duedate_start")){
            DueDate_Start = null
        }
        let DueDate_End = urlParams.get("duedate_end");
        if (!urlParams.get("duedate_end")){
            DueDate_End = null
        }
        let Status_Label = urlParams.get("status_label");
        if (!urlParams.get("status_label")){
            Status_Label = ""
        }
        let Approver_EmployeeCode = urlParams.get("approver");
        if (!urlParams.get("approver")){
            Approver_EmployeeCode = ""
        }
        let RejectComment = urlParams.get("reject_comment");
        if (!urlParams.get("reject_comment")){
            RejectComment = ""
        }

        const PO_Request = await this.PO_RequestRepository.createQueryBuilder("PO_Request")
        .select("PO_Request.PR_Id")
        .addSelect("PO_Request.PONumber")
        .addSelect(["Supplier.Code", "Supplier.Name"])
        .addSelect("PO_Request.DueDate")
        .addSelect("CreateBy.EmployeeCode")
        .addSelect("Status.Label")
        .addSelect("Approver.EmployeeCode")
        .addSelect("PO_Request.RejectComment")
        .addSelect("SUM(PO_Item.Amount)", "sumAmount")
        .addSelect("PO_Request.PR_UpdateOn")
        .groupBy("PO_Request.PR_Id")
        .addGroupBy("PO_Request.PONumber")
        .addGroupBy("Supplier.Code")
        .addGroupBy("Supplier.Name")
        .addGroupBy("PO_Request.DueDate")
        .addGroupBy("CreateBy.EmployeeCode")
        .addGroupBy("Status.Label")
        .addGroupBy("Approver.EmployeeCode")
        .addGroupBy("PO_Request.RejectComment")
        .addGroupBy("PO_Request.PR_UpdateOn")
        .where(
            new Brackets((qb) => {
                qb.where("PO_Request.PR_Id = :PR_Id", { PR_Id })
                .orWhere(":PR_Id = 0", { PR_Id })
            })
        )
        .andWhere(
            new Brackets((qb) => {
                qb.where("PO_Request.PONumber = :PONumber", { PONumber })
                .orWhere(":PONumber = ''", { PONumber })
            })
        )
        .andWhere(
            new Brackets((qb) => {
                qb.where("Supplier.Code = :Supplier_Code", { Supplier_Code })
                .orWhere(":Supplier_Code = ''", { Supplier_Code })
            })
        )
        .andWhere(
            new Brackets((qb) => {
                qb.where("Supplier.Name = :Supplier_Name", { Supplier_Name })
                .orWhere(":Supplier_Name = ''", { Supplier_Name })
            })
        )
        .andWhere(
            new Brackets((qb) => {
                qb.where("PO_Request.DueDate >= :DueDate_Start", { DueDate_Start })
                .orWhere(":DueDate_Start is null", { DueDate_Start })
            })
        )
        .andWhere(
            new Brackets((qb) => {
                qb.where("PO_Request.DueDate <= :DueDate_End", { DueDate_End })
                .orWhere(":DueDate_End is null", { DueDate_End })
            })
        )
        .andWhere(
            new Brackets((qb) => {
                qb.where("Status.Label = :Status_Label", { Status_Label })
                .orWhere(":Status_Label = ''", { Status_Label })
            })
        )
        .andWhere(
            new Brackets((qb) => {
                qb.where("Approver.EmployeeCode = :Approver_EmployeeCode", { Approver_EmployeeCode })
                .orWhere(":Approver_EmployeeCode = ''", { Approver_EmployeeCode })
            })
        )
        .andWhere(
            new Brackets((qb) => {
                qb.where("PO_Request.RejectComment = :RejectComment", { RejectComment })
                .orWhere(":RejectComment = ''", { RejectComment })
            })
        )
        .leftJoin("PO_Request.Supplier", "Supplier")
        .leftJoin("PO_Request.Employee_CreateBy", "CreateBy")
        .leftJoin("PO_Request.Status", "Status")
        .leftJoin("PO_Request.Employee_ApproverId", "Approver")
        .leftJoin("PO_Request.PO_Item", "PO_Item")
        .getRawMany();
        /*await this.PO_RequestRepository.findOne({
            where: { Or(PR_Id: PR_Id, PR_Id = "") }
        })*/

        if (!PO_Request) {
            return "unregistered PO_Request"
        }
        return PO_Request
    }

    async save(request: Request, response: Response, next: NextFunction) {
        const { PR_SupplierId, PONumber, DueDate, PR_CreateBy, PR_CreateOn, PR_UpdateOn, PR_StatusId, PR_ApproverId, RejectComment } = request.body;

        const po_request = Object.assign(new PO_Request_TestDB(), {
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

        const po_request = Object.assign(new PO_Request_TestDB(), {
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
        const po_request = Object.assign(new PO_Request_TestDB(), {
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