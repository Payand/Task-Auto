import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @CreateDateColumn({ name: "created_on" })
  createdOn: Date;

  @UpdateDateColumn({ name: "updated_on" })
  updatedOn: Date;
}
