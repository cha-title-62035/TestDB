import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Category_TestDB {

    @PrimaryGeneratedColumn()
    C_Id: number

    @Column()
    Label: string

    @Column()
    Order: string

    @Column()
    Is_Active: boolean

}
