import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import categoriesRoutes from "./modules/categories/categories.routes.js";
import brandsRoutes from "./modules/brands/brands.routes.js";
import productsRoutes from "./modules/products/products.routes.js";

const app: Application = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/brands", brandsRoutes);
app.use("/api/v1/products", productsRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
