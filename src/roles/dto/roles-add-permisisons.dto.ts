import { IsEnum, IsNotEmpty } from "class-validator";
import { EPermissions, ERoles } from "src/auth/enums/auth.enum";

export class RoleAddPermissions {
    @IsEnum(ERoles)
    @IsNotEmpty()
    roleName: ERoles
    
    @IsEnum(EPermissions, {each: true})
    @IsNotEmpty()
    permissions: EPermissions[];
}