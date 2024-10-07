import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { rolesKey } from "src/auth/decorators/roles.decorator";
import { Roles } from "src/auth/enums/roles.enum";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(rolesKey, [
            context.getHandler(),
            context.getClass()
        ])
        if (!requiredRoles) {
            return true
        }
        const request = context.switchToHttp().getRequest()
        const user = request.user
        if (!user) { return false }
        return requiredRoles.some(role => user['role'] === role)
    }
}