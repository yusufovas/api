import { SetMetadata } from "@nestjs/common"
import { Roles } from "../enums/roles.enum"

export const rolesKey = 'roles_key11'
export const UserRoles = (...roles: Roles[]) => SetMetadata(rolesKey, roles)