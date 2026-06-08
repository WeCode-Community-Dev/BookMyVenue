import { AppError } from '../../domain/errors/app.error.js'
import { statusCode } from '../../shared/constants/enums/statusCode.js'


export const validate = (schema, target = 'body') => {
    return (req, res, next) => {
        console.log("RAW BODY:", req.body);
        const result = schema.safeParse(req[target])
        if(!result.success){
            const errors = result.error.issues.map(issue => issue.message)
            return next(new AppError(errors.join(", "), statusCode.BAD_REQUEST))
        }
        req[target] = result.data
        next()
    }
}