import { JwtPayload } from "../../../shared/jwt/types/jwt-payload.type";

export type AuthenticatedRequest = Request & {
    user: JwtPayload;
};
