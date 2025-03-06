import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Supplier } from "./Supplier"
import { Employee } from "./Employee"
import { Status } from "./Status"

@Entity()
export class PO_Request {

    @PrimaryGeneratedColumn()
    PR_Id: number

    @Column()
    PR_SupplierId: number

    @ManyToOne(type => Supplier)
    @JoinColumn({ name: "PR_SupplierId"})
    Supplier: Supplier

    @Column()
    PONumber: string

    @Column({ type: "timestamptz" })
    DueDate: Date

    @Column()
    PR_CreateBy: number

    @ManyToOne(type => Employee)
    @JoinColumn({ name: "PR_CreateBy"})
    Employee_CreateBy: Employee

    @Column({ type: "timestamptz" })
    PR_CreateOn: Date

    @Column({ type: "timestamptz" })
    PR_UpdateOn: Date

    @Column()
    PR_StatusId: number

    @ManyToOne(type => Status)
    @JoinColumn({ name: "PR_StatusId"})
    Status: Status

    @Column()
    PR_ApproverId

    @ManyToOne(type => Employee)
    @JoinColumn({ name: "PR_ApproverId"})
    Employee_ApproverId: Employee

    @Column()
    RejectComment: string

}
