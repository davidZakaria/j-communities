import "dotenv/config";
import { createApp } from "./server/app.js";
import { config } from "./server/config.js";
import { assertSecureStartup } from "./server/validateEnv.js";

assertSecureStartup();

const app = createApp();

app.listen(config.port, () => {
  console.log(`J Communities server listening on port ${config.port}`);
});
