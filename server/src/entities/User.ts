import { IsEmail, Length } from "class-validator";
import { Entity, Column, Index, OneToMany, BeforeInsert } from "typeorm";
import bcrypt from "bcryptjs";
import Post from "./Post";
import Vote from "./Vote";
import BaseEntity from "./Entity";

@Entity("users")
export class User extends BaseEntity {
    @Index()
    @IsEmail(undefined, { message: "이메일 형식이 아닙니다" })
    @Length(1, 255, { message: "이메일을 입력해주세요" })
    @Column({ unique: true })
    email: string;

    @Index()
    @Length(3, 32, { message: "사용자 이름은 3자 이상입니다" })
    @Column({ unique: true })
    username: string;

    @Column()
    @Length(6, 255, { message: "비밀번호는 6자리 이상입니다" })
    password: string;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];

    @OneToMany(() => Vote, (vote) => vote.user)
    votes: Vote[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 6);
    }
}
