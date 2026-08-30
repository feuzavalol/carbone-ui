import type { AuthUser } from "../types/authTypes";

export function checkUser(user: AuthUser, committeeId: string){
    return user.role != "LIS" || committeeId == user.committeeId;
}