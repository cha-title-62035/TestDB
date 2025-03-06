import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { Position } from "./Position"

@Entity()
export class Employee {

    @PrimaryGeneratedColumn()
    E_Id: number

    @Column()
    EmployeeCode: string

    @Column()
    E_PositionId: number

    @ManyToOne((type) => Position, (position) => position.P_Id)
    @JoinColumn({ name: "E_PositionId"})
    Position: Position

}
