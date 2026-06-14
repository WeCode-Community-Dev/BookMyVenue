import { signupUser, loginUser, loginAdmin } from "./auth.service.js";
import { STATUS_CODES } from "../../shared/constants/statusCodes.js";
import { SUCCESS_MESSAGES } from "../../shared/constants/messages.js";
import ApiResponse from "../../shared/utils/apiResponse.js";

export const signupController = async (req, res, next) => {
  try {
    const user = await signupUser(req.body);

    return res
      .status(STATUS_CODES.CREATED)
      .json(
        new ApiResponse(
          STATUS_CODES.CREATED,
          SUCCESS_MESSAGES.ACCOUNT_CREATED,
          user,
        ),
      );
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const user = await loginUser(req.body);

    return res

      .status(STATUS_CODES.OK)

      .json(
        new ApiResponse(
          STATUS_CODES.OK,

          SUCCESS_MESSAGES.LOGIN_SUCCESSFUL,

          user,
        ),
      );
  } catch (error) {
    next(error);
  }
};

export const adminLoginController = async (req, res, next) => {
  try {
    const admin = await loginAdmin(req.body);

    return res.status(200).json(
      new ApiResponse(
        STATUS_CODES.OK,

        SUCCESS_MESSAGES.LOGIN_SUCCESSFUL,
        admin,
      ),
    );
  } catch (error) {
    next(error);
  }
};
