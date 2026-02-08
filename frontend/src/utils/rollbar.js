export const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_TOKEN,
  environment: import.meta.env.MODE,
  captureUncaught: true,
  captureUnhandledRejections: true,
};

console.log("VITE_ROLLBAR_TOKEN =", import.meta.env.VITE_ROLLBAR_TOKEN);
