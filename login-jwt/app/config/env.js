import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

// Carga antes de importar la configuracion de Sequelize o JWT.
dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)), quiet: true });
