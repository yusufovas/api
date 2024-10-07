import { Request } from "express";
import { UsersEntity } from "src/users/entities/users.entity";

export interface ExtendedRequestObject extends Request {
    user: UsersEntity,
    userId: UsersEntity
}