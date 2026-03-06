import { RoleEnums } from "../Common/Enums/user.enums.js";
import { forbiddenException } from "../Common/response/errorResponse.js";



export function authorization(role=[RoleEnums.USER]){
    return (req,next) => {
        if(!role.includes(req.user.role)){
            return forbiddenException("You don't have permission to access this resource")
        }
        next()
    }
}
