import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

enum Role {
    ADMIN = 'admin',
    USER = 'user'
}

enum AuthServiceProvider {
    GOOGLE = 'google',
    GITHUB = 'github'
}

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({length: 100,unique: true})
    email: string;

    @Column({nullable: true})
    password?: string;

    @Column()
    fullName?: string;

    @Column({type: 'enum', enum: Role, default: Role.USER})
    role?: string;

    @Column()
    image?: string;

    @Column({type: 'enum', enum: AuthServiceProvider, default: AuthServiceProvider.GOOGLE})
    authProvider?: AuthServiceProvider;


    @Column({default: false})
    isVerified?: boolean;

    @Column()
    isActive?: boolean;

    @Column()
    lastLogin?: Date;

    @Column()
    createdAt?: Date;

    constructor(user: Partial<User>){
        Object.assign(this, user);
    }
}
