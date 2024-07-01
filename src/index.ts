import express, { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import { Environment } from "./_common/enums/environment.enum";
import { env } from "process";
import { getEnv } from "./_common/helpers/environment.helper";
import { IPAPI } from "./_common/types/IpApi";
import { Weather } from "./_common/types/Weather";
// import dotenv from "dotenv";

// dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.get("/api/hello", async (req: Request, res: Response) => {
  try {
    const visitorName = (req.query.visitor_name as string) || "Visitor";
    const clientIp =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";

    let transformedClientIp = "";

    // for mocking purpose
    if (getEnv("NODE_ENV") === Environment.DEV) {
      transformedClientIp = "102.89.23.181";
    } else {
      transformedClientIp = Array.isArray(clientIp) ? clientIp[0] : clientIp;
      transformedClientIp = transformedClientIp?.split(",")[0] || "";
    }

    const { data = null } = await axios.get<IPAPI>(
      `https://ipapi.co/${transformedClientIp}/json?token=${getEnv(
        "IP_INFO_TOKEN"
      )}`
    );

    if (!data) {
      throw new Error("Failed to fetch IP from external API");
    }

    const { city: location } = data;
    // console.log({ latitude, longitude, location });

    const { data: weatherData = null } = await axios.get<Weather>(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${getEnv(
        "OPENWEATHERMAP_API_KEY"
      )}&units=metric`
    );

    if (!weatherData) {
      throw new Error("Failed to fetch weather data from external API");
    }
    const temperature = weatherData?.main?.temp;

    res.json({
      client_ip: transformedClientIp,
      location,
      greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`,
    });
  } catch (error: any) {
    // console.error("Error fetching data:", error);

    res.status(500).json({
      error: error?.message || "Failed to fetch data from external APIs",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
