import createError from "http-errors";
import express from "express";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import indexRouter from "./routes/index.mjs";
// still fix ig downloader
// import igRouter from "./routes/instagramRouter.mjs";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// view engine setup
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(helmet());
app.disable("x-powered-by");

/* // enable cors
const allowlist = "line-video.herokuapp.com|userbiasa.github.io";
const corsOptions = function (req, callback) {
  let corsOptions;
  const target = req.header("Origin") || "";
  switch (target) {
    case (new RegExp(allowlist).exec(target) || {}).input:
      corsOptions = {
        methods: "GET,PUT,POST,DELETE",
        origin: true,
        credentials: true,
      }; // reflect (enable) the requested origin in the CORS response
      break;
    default:
      corsOptions = {
        methods: "",
        origin: false,
        credentials: false,
      }; // disable CORS for this request
      break;
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
}; */
app.use(cors({ exposedHeaders: "*" }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(join(__dirname, "public")));
app.use(compression());

app.use("/", indexRouter);
// app.use("/", igRouter);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  return res.render("index", { title: "Express" });
});

export default app;
