import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Position_TestDB } from "./Position"

@Entity()
export class Employee_TestDB {

    @PrimaryGeneratedColumn()
    E_Id: number

    @Column()
    EmployeeCode: string

    @Column()
    E_PositionId: number

    @ManyToOne((type) => Position_TestDB, (position) => position.P_Id)
    @JoinColumn({ name: "E_PositionId"})
    Position: Position_TestDB

}
