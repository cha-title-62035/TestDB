import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, JoinTable } from "typeorm"
import { Supplier_TestDB } from "./Supplier"
import { Employee_TestDB } from "./Employee"
import { Status_TestDB } from "./Status"
import { PO_Item_TestDB } from "./PO_Item"

@Entity()
export class PO_Request_TestDB {

    @PrimaryGeneratedColumn()
    PR_Id: number

    @Column()
    PR_SupplierId: number

    @ManyToOne(type => Supplier_TestDB)
    @JoinColumn({ name: "PR_SupplierId"})
    Supplier: Supplier_TestDB

    @Column()
    PONumber: string

    @Column({ type: "timestamptz" })
    DueDate: Date

    @Column()
    PR_CreateBy: number

    @ManyToOne(type => Employee_TestDB)
    @JoinColumn({ name: "PR_CreateBy"})
    Employee_CreateBy: Employee_TestDB

    @Column({ type: "timestamptz" })
    PR_CreateOn: Date

    @Column({ type: "timestamptz" })
    PR_UpdateOn: Date

    @Column()
    PR_StatusId: number

    @ManyToOne(type => Status_TestDB)
    @JoinColumn({ name: "PR_StatusId"})
    Status: Status_TestDB

    @Column()
    PR_ApproverId

    @ManyToOne(type => Employee_TestDB)
    @JoinColumn({ name: "PR_ApproverId"})
    Employee_ApproverId: Employee_TestDB

    @Column()
    RejectComment: string

    @OneToMany(type => PO_Item_TestDB, PO_Item => PO_Item.PO_Request)
    @JoinTable()
    PO_Item: PO_Item_TestDB

}
