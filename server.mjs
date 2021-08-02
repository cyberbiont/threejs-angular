"use strict";

import Koa from "koa";
import { ObjectId } from "mongodb";
import Router from "@koa/router";
// import cors from "@koa/cors";
import bodyParser from "koa-body";
import cfg from "./cfg.js";
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
app.use(bodyParser());

// app.use(cors({ credentials: true }));
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

// db.createCollection("three");
const THREE_COLLECTION_NAME = "three";

/*  "/api/products"
 *  GET: finds all products
 */
router
  .get(`/api/${THREE_COLLECTION_NAME}`, async (ctx) => {
    try {
      const data = await ctx.db
        .collection(THREE_COLLECTION_NAME)
        .find({})
        .toArray();
      ctx.status = 200;
      ctx.body = data;
    } catch (err) {
      onError(ctx, err.message, "Failed to get data.");
    }
  })

  /*  "/api/products"
   *   POST: creates a new product
   */
  .post(`/api/${THREE_COLLECTION_NAME}`, async (ctx) => {
    const product = ctx.request.body;
    try {
      const doc = await ctx.db
        .collection(THREE_COLLECTION_NAME)
        .insertOne(product);
      ctx.status = 201;
      // ctx.body = doc.ops[0];
    } catch (err) {
      onError(ctx, err.message, "Failed to create new product.");
    }
  })

  /*  "/api/products/:id"
   *   DELETE: deletes saved scene by id
   */
  .delete(`/api/${THREE_COLLECTION_NAME}:id`, async (ctx) => {
    if (ctx.params.id.length > 24 || ctx.params.id.length < 24) {
      onError(
        ctx,
        "Invalid product id",
        "ID must be a single String of 12 bytes or a string of 24 hex characters.",
        400
      );
    } else {
      try {
        await ctx.db
          .collection(THREE_COLLECTION_NAME)
          .deleteOne({ _id: new ObjectId(ctx.params.id) });
        ctx.status = 200;
        ctx.body = ctx.params.id;
      } catch (err) {
        onError(ctx, err.message, "Failed to delete product.");
      }
    }
  });

app.use(router.routes());

function onError(ctx, reason, message, code) {
  console.log("Error: " + reason);
  ctx.status = code ?? 500;
  ctx.body = { error: message };
}
