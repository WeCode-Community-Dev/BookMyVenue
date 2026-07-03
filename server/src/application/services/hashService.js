export class IHashService {
    async hash(password) {
        throw new Error("Method not implemented");
    }
    async hashToken(token){
        throw new Error("Method not implemented")
    }
    async compare(password, hashedPassword){
        throw new Error("Method not implemented")
    }
}