import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, OneToMany, JoinTable } from "typeorm"
import { Employee_TestDB } from "./Employee"
import { ItemMappingSupplier_TestDB } from "./ItemMappingSupplier"
import { Category_TestDB } from "./Category"

@Entity()
export class Item_TestDB {

    @PrimaryGeneratedColumn()
    I_Id: number

    @Column()
    Code: string

    @Column()
    Name: string

    @Column()
    I_CategoryId: number

    @ManyToOne(type => Category_TestDB)
    @JoinColumn({ name: "I_CategoryId" })
    Category: Category_TestDB

    @Column({ type: "decimal" })
    Price: number

    @Column()
    Unit: string

    @Column()
    IsActive: boolean

    @Column()
    I_CreateBy: number

    @ManyToOne(type => Employee_TestDB)
    @JoinColumn({ name: "I_CreateBy" })
    Employee_CreateBy: Employee_TestDB

    @Column({ type: "timestamptz" })
    I_CreateOn: Date

    @Column()
    I_UpdateBy: number

    @ManyToOne(type => Employee_TestDB)
    @JoinColumn({ name: "I_UpdateBy"})
    Employee_UpdateBy: Employee_TestDB

    @Column({ type: "timestamptz" })
    I_UpdateOn: Date

    @OneToMany(type => ItemMappingSupplier_TestDB, ItemMappingSupplier => ItemMappingSupplier.Item)
    @JoinTable()
    ItemMappingSupplier: ItemMappingSupplier_TestDB

}
