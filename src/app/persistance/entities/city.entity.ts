import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
// Entities
import { User } from "@root/app/persistance/entities/user.entity";


@Entity()
export class City {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  postCode: string;

  @Column()
  country: string;

  @Column()
  places: string;

  @Column()
  placeName: string;

  @Column()
  state: string;

  @Column()
  abbreviation: string;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn({ name: "created_on" })
  createdOn: Date;

  @UpdateDateColumn({ name: "updated_on" })
  updatedOn: Date;
}
