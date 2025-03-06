import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { PO_Request } from "./PO_Request"
import { Item } from "./Item"

@Entity()
export class PO_Item {

    @PrimaryGeneratedColumn()
    PI_Id: number

    @Column()
    PI_PORequestId: number

    @ManyToOne(type => PO_Request)
    @JoinColumn({ name: "PI_PORequestId"})
    PO_Request: PO_Request

    @Column()
    PI_ItemId: number

    @ManyToOne(type => Item)
    @JoinColumn({ name: "PI_ItemId"})
    Item: Item

    @Column()
    Qty: number

    @Column({ type: "decimal"})
    Amount: number

    @Column()
    Comment: string

}
