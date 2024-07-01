type EnvKeys = "IP_INFO_TOKEN" | "NODE_ENV" | "OPENWEATHERMAP_API_KEY";

export const getEnv = (key: EnvKeys) => {
  try {
    return process.env[key];
  } catch (error) {
    throw new Error(`Environment variable ${key} not found`);
  }
};
