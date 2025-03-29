import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { PO_Request_TestDB } from "./PO_Request"
import { Item_TestDB } from "./Item"

@Entity()
export class PO_Item_TestDB {

    @PrimaryGeneratedColumn()
    PI_Id: number

    @Column()
    PI_PORequestId: number

    @ManyToOne(type => PO_Request_TestDB)
    @JoinColumn({ name: "PI_PORequestId"})
    PO_Request: PO_Request_TestDB

    @Column()
    PI_ItemId: number

    @ManyToOne(type => Item_TestDB)
    @JoinColumn({ name: "PI_ItemId"})
    Item: Item_TestDB

    @Column()
    Qty: number

    @Column({ type: "decimal"})
    Amount: number

    @Column()
    Comment: string

}
