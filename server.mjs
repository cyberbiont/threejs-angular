"use strict";

import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-body";
import cfg from "./cfg.js";
import cors from "@koa/cors";
import { dirname } from "path";
import { fileURLToPath } from "url";
import mongodb from "mongodb";
import serve from "koa-static";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Local database URI.
const LOCAL_DATABASE = "mongodb://localhost:27017/app";
// Local port.
const LOCAL_PORT = 8080;

const app = new Koa();
app.use(bodyParser({ jsonLimit: "10mb" }));

app.use(cors({ credentials: true }));

app.use(serve(`${__dirname}/dist/prod`));

const router = new Router();

app.listen(cfg.port, () =>
  console.log(`Started server at http://localhost:${cfg.port} !`)
);

const client = await mongodb.MongoClient.connect(
  process.env.MONGODB_URI || LOCAL_DATABASE,
  {
    // useUnifiedTopology: true,
    useNewUrlParser: true,
  }
).catch((error) => {
  console.log(error);
  process.exit(1);
});

const db = client.db();
app.context.db = db;

console.log("Database connection done.");

const THREE_COLLECTION_NAME = "three";

/*  "/api/three"
 *  GET: gets all collection data
 */
router
  .get(`/api/${THREE_COLLECTION_NAME}`, async (ctx) => {
    try {
      const data = await db
        .collection(THREE_COLLECTION_NAME)
        .find({})
        .toArray();
      ctx.status = 200;
      ctx.body = data;
    } catch (err) {
      onError(ctx, err.message, "Failed to get data.");
    }
  })

  /*  "/api/three"
   *   PUT: saves / updates the scene in the MongoDB database
   */
  .put(`/api/${THREE_COLLECTION_NAME}`, async (ctx) => {
    const scene = ctx.request.body;
    try {
      const collection = db.collection(THREE_COLLECTION_NAME);
      await collection.replaceOne({}, scene, { upsert: true });
      ctx.status = 201;
    } catch (err) {
      onError(ctx, err.message, "Failed to save the scene.");
    }
  })

  /*  "/api/three"
   *   DELETE: puts the serialized current scene into mongodb database
   */
  .delete(`/api/${THREE_COLLECTION_NAME}`, async (ctx) => {
    try {
      await db.collection(THREE_COLLECTION_NAME).deleteOne({});
      ctx.status = 200;
    } catch (err) {
      onError(ctx, err.message, "Failed to delete the saved scene.");
    }
  });

app.use(router.routes());

function onError(ctx, reason, message, code) {
  console.log(`"Error: "${reason}`);
  ctx.status = code ?? 500;
  ctx.body = { error: message };
}
