import { signupUser } from './auth.service.js';
import { STATUS_CODES } from '../../shared/constants/statusCodes.js';
import { SUCCESS_MESSAGES } from '../../shared/constants/messages.js';
import ApiResponse from '../../shared/utils/apiResponse.js';
export const signupController = async (
    req,
    res,
    next
) => {
    try {

        const user = await signupUser(req.body);

        res.status(STATUS_CODES.CREATED).json(new ApiResponse(

            STATUS_CODES.CREATED,

            SUCCESS_MESSAGES.ACCOUNT_CREATED,

            {

                id: user.id,

                name: user.name,

                email: user.email

            }

        ));

    } catch (error) {
        next(error);
    }
};