import { z } from "zod";
import * as dotenv from "dotenv";
dotenv.config();

const schema = z.object({
  RPC_URL: z.string(),
});

type EnvConfig = z.infer<typeof schema>;

export { EnvConfig };

export default schema.parse(process.env);
