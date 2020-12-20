import {Entity, PrimaryGeneratedColumn, Column, OneToOne,JoinColumn, ManyToOne} from "typeorm";
import { Author } from "./Author";

@Entity({name:'books'})
export class Book {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:'varchar',length:80})
    title: string;

    @ManyToOne(()=>Author,author=>author.books,{eager:true}) 
    author:Author;
}
  