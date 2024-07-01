"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const environment_enum_1 = require("./_common/enums/environment.enum");
const environment_helper_1 = require("./_common/helpers/environment.helper");
// import dotenv from "dotenv";
// dotenv.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.get("/api/hello", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const visitorName = req.query.visitor_name || "Visitor";
        const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
        let transformedClientIp = "";
        // for mocking purpose
        if ((0, environment_helper_1.getEnv)("NODE_ENV") === environment_enum_1.Environment.DEV) {
            transformedClientIp = "102.89.23.181";
        }
        else {
            transformedClientIp = Array.isArray(clientIp) ? clientIp[0] : clientIp;
            transformedClientIp = (transformedClientIp === null || transformedClientIp === void 0 ? void 0 : transformedClientIp.split(",")[0]) || "";
        }
        const { data = null } = yield axios_1.default.get(`https://ipapi.co/${transformedClientIp}/json?token=${(0, environment_helper_1.getEnv)("IP_INFO_TOKEN")}`);
        if (!data) {
            throw new Error("Failed to fetch IP from external API");
        }
        const { city: location } = data;
        // console.log({ latitude, longitude, location });
        const { data: weatherData = null } = yield axios_1.default.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${(0, environment_helper_1.getEnv)("OPENWEATHERMAP_API_KEY")}&units=metric`);
        if (!weatherData) {
            throw new Error("Failed to fetch weather data from external API");
        }
        const temperature = (_a = weatherData === null || weatherData === void 0 ? void 0 : weatherData.main) === null || _a === void 0 ? void 0 : _a.temp;
        res.json({
            client_ip: transformedClientIp,
            location,
            greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`,
        });
    }
    catch (error) {
        // console.error("Error fetching data:", error);
        res.status(500).json({
            error: (error === null || error === void 0 ? void 0 : error.message) || "Failed to fetch data from external APIs",
        });
    }
}));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
