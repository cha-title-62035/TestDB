import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User_TestDB {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column({nullable:false,default:'admin'})
    password: string

    @Column()
    age: number

}
