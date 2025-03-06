import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Employee } from "./Employee"

@Entity()
export class Supplier {

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

    @ManyToOne(type => Employee)
    @JoinColumn({ name: "S_CreateBy"})
    Employee_CreateBy: Employee

    @Column({ type: "timestamptz" })
    S_UpdateOn: Date

    @Column()
    S_UpdateBy: number

    @ManyToOne(type => Employee)
    @JoinColumn({ name: "S_UpdateBy"})
    Employee_UpdateBy: Employee

}
