import http from "http";

import Koa from "koa";
// import cors from "@koa/cors";
import bodyParser from "koa-better-body";

import cfg from "./cfg.js";
import Router from '@koa/router';

const app = new Koa();
// app.use(bodyParser());
// app.use(cors({ credentials: true }));
app.use((ctx) => {
  ctx.body = "Hello World";
});
// const server = http.Server(app);
const router = new Router();
router.get('koa-example', '/', (ctx) => {
  ctx.body = 'Hello World';
});
 
app.listen(cfg.port, () =>
  console.log(`Started server at http://localhost:${cfg.port} !`)
);
