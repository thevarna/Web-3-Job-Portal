"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware_dev = exports.middleware_provider = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
function middleware_provider(req, res, next) {
    var _a;
    const authHeader = (_a = req.headers["authorization"]) !== null && _a !== void 0 ? _a : "";
    try {
        const decoded = jsonwebtoken_1.default.verify(authHeader, config_1.JWT_SECRET);
        //@ts-ignore
        if (decoded.providerId) {
            //@ts-ignore
            req.providerId = decoded.providerId;
            return next();
        }
        else {
            return res.status(403).json({
                message: "User not logged in!",
            });
        }
    }
    catch (e) {
        return res.status(403).json({
            message: "You are not logged in",
        });
    }
}
exports.middleware_provider = middleware_provider;
function middleware_dev(req, res, next) {
    var _a;
    const authHeader = (_a = req.headers["authorization"]) !== null && _a !== void 0 ? _a : "";
    try {
        const decoded = jsonwebtoken_1.default.verify(authHeader, config_1.JWT_SECRET_DEV);
        //@ts-ignore
        if (decoded.devId) {
            //@ts-ignore
            req.devId = decoded.devId;
            return next();
        }
    }
    catch (e) {
        return res.status(402).json({
            message: "You are not logged in!",
        });
    }
}
exports.middleware_dev = middleware_dev;
