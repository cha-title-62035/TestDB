import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Position_TestDB {

    @PrimaryGeneratedColumn()
    P_Id: number

    @Column()
    Label: string

    @Column()
    Order: number

    @Column()
    Is_Active: boolean

}
