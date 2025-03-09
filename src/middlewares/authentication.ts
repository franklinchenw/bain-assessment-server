import { Request, Response, NextFunction, RequestHandler } from "express";
import { HTTP_STATUS_CODE } from "../constants/httpStatusCode";
import response from "../utilities/response";
import { User } from "../databases/modals/user.modal";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

// imitate the request id to the user id
const authenticateUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestId = req.header("X-Request-Id");
    if (!requestId) {
      response(res, HTTP_STATUS_CODE.UNAUTHORIZED, "Unauthorized");
      return;
    }

    // check if the user exists
    let user = await User.query().where("id", requestId).first();
    if (!user) {
      user = await User.query().insert({
        id: requestId,
      });
    }
    req.userId = user.id;
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticateUser;
