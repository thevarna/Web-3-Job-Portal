import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_SECRET_DEV } from "../config";

export function middleware_provider(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"] ?? "";
  try {
    const decoded = jwt.verify(authHeader, JWT_SECRET);
    //@ts-ignore
    if (decoded.providerId) {
      //@ts-ignore
      req.providerId = decoded.providerId;
      return next();
    } else {
      return res.status(403).json({
        message: "User not logged in!",
      });
    }
  } catch (e) {
    return res.status(403).json({
      message: "You are not logged in",
    });
  }
}

export function middleware_dev(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"] ?? "";
  try {
    const decoded = jwt.verify(authHeader, JWT_SECRET_DEV);
    //@ts-ignore
    if (decoded.devId) {
      //@ts-ignore
      req.devId = decoded.devId;
      return next();
    }
  } catch (e) {
    return res.status(402).json({
      message: "You are not logged in!",
    });
  }
}
