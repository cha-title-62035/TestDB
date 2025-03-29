import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Employee_TestDB } from "./Employee"

@Entity()
export class Supplier_TestDB {

    @PrimaryGeneratedColumn()
    S_Id: number

    @Column()
    Code: string

    @Column()
    Name: string

    @Column()
    IsActive: boolean

    @Column({ type: "timestamptz" })
    S_CreateOn: Date

    @Column()
    S_CreateBy: number

    @ManyToOne(type => Employee_TestDB)
    @JoinColumn({ name: "S_CreateBy"})
    Employee_CreateBy: Employee_TestDB

    @Column({ type: "timestamptz" })
    S_UpdateOn: Date

    @Column()
    S_UpdateBy: number

    @ManyToOne(type => Employee_TestDB)
    @JoinColumn({ name: "S_UpdateBy"})
    Employee_UpdateBy: Employee_TestDB

}