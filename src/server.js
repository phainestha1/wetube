import "./db";
import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

// Variables
const app = express();
const logger = morgan("dev");

// App.set & App.use
app.set("view engine", "pug");
app.set("views", process.cwd()+ "/src/views");
app.use(logger);
app.use(express.urlencoded({extended: true}));
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

// Application Listening & PORT No. Setting
const PORT = 4000;
app.listen(PORT, () => {console.log(`Server on PORT localhost:${PORT} 🔥`)});