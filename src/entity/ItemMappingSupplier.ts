import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Item } from "./Item"
import { Supplier } from "./Supplier"

@Entity()
export class ItemMappingSupplier {

    @PrimaryGeneratedColumn()
    IMS_Id: number

    @Column()
    IMS_ItemId: number

    @ManyToOne(type => Item)
    @JoinColumn({ name: "IMS_ItemId"})
    Item: Item

    @Column()
    IMS_SupplierId: number

    @ManyToOne(type => Supplier)
    @JoinColumn({ name: "IMS_SupplierId"})
    Supplier: Supplier

}
