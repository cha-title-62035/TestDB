import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Item_TestDB } from "./Item"
import { Supplier_TestDB } from "./Supplier"

@Entity()
export class ItemMappingSupplier_TestDB {

    @PrimaryGeneratedColumn()
    IMS_Id: number

    @Column()
    IMS_ItemId: number

    @ManyToOne(type => Item_TestDB)
    @JoinColumn({ name: "IMS_ItemId"})
    Item: Item_TestDB

    @Column()
    IMS_SupplierId: number

    @ManyToOne(type => Supplier_TestDB)
    @JoinColumn({ name: "IMS_SupplierId"})
    Supplier: Supplier_TestDB

}
