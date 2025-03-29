import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Status_TestDB {

    @PrimaryGeneratedColumn()
    ST_Id: number

    @Column()
    Label: string

    @Column()
    Order: number

    @Column()
    Is_Active: boolean

}
