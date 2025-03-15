import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, OneToMany, JoinTable } from "typeorm"
import { Employee } from "./Employee"
import { ItemMappingSupplier } from "./ItemMappingSupplier"

@Entity()
export class Item {

    @PrimaryGeneratedColumn()
    I_Id: number

    @Column()
    Code: string

    @Column()
    Name: string

    @Column()
    I_CategoryId: number

    @Column({ type: "decimal" })
    Price: number

    @Column()
    Unit: string

    @Column()
    IsActive: boolean

    @Column()
    I_CreateBy: number

    @ManyToOne(type => Employee)
    @JoinColumn({ name: "I_CreateBy"})
    Employee_CreateBy: Employee

    @Column({ type: "timestamptz" })
    I_CreateOn: Date

    @Column()
    I_UpdateBy: number

    @ManyToOne(type => Employee)
    @JoinColumn({ name: "I_UpdateBy"})
    Employee_UpdateBy: Employee

    @Column({ type: "timestamptz" })
    I_UpdateOn: Date

    @OneToMany(type => ItemMappingSupplier, ItemMappingSupplier => ItemMappingSupplier.Item)
    @JoinTable()
    ItemMappingSupplier: ItemMappingSupplier

}
