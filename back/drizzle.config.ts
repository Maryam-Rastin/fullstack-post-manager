// import { defineConfig } from "drizzle-kit";

// export default defineConfig({
//   schema: "./schema.ts",
//   driver: "pg",
//   dbCredentials: {
//     connectionString:String (process.env.POSTGRES_UR),
//   },
//   verbose: true,
//   strict:true,
// })

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out:"./src/db/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  verbose: true,
  strict: true,
})