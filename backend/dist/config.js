"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRIVATE_KEY = exports.JWT_SECRET_DEV = exports.JWT_SECRET = void 0;
exports.JWT_SECRET = process.env.JWT_SECRET || '';
exports.JWT_SECRET_DEV = process.env.JWT_SECRET_DEV || '';
exports.PRIVATE_KEY = process.env.PRIVATE_KEY || '';
