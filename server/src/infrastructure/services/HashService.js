import bcrypt from "bcrypt";

export default class HashService{
    static async hash(data){
        return await bcrypt.hash(data,10)
    }
    static async compare(data,hashedData){
        return await bcrypt.compare(data,hashedData)
    }
}