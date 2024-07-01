"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = void 0;
const getEnv = (key) => {
    try {
        return process.env[key];
    }
    catch (error) {
        throw new Error(`Environment variable ${key} not found`);
    }
};
exports.getEnv = getEnv;
