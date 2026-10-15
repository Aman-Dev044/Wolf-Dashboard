/**
 * Seeds MongoDB with the Wolf catalogue and site content.
 * Run: npm run seed            (upserts, keeps orders/users)
 *      npm run seed -- --fresh (drops products & categories first)
 */
import "dotenv/config";
import path from "node:path";
import fs from "node:fs";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../lib/db";
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { User } from "../models/User";
import { SiteContent } from "../models/Messages";

const dataDir = path.join(__dirname, "..", "data");
const read = <T>(f: string): T => JSON.parse(fs.readFileSync(path.join(dataDir, f), "utf8"));

async function main() {
  await connectDB();
  console.log(`Connected to MongoDB database "${mongoose.connection.name}"`);

  if (process.argv.includes("--fresh")) {
    await Promise.all([Product.deleteMany({}), Category.deleteMany({})]);
    console.log("Cleared products and categories");
  }

  const categories = read<Array<Record<string, unknown>>>("categories.json");
  await Category.bulkWrite(
    categories.map(({ count: _count, ...c }) => ({
      updateOne: { filter: { slug: c.slug }, update: { $set: c }, upsert: true },
    }))
  );
  console.log(`Categories: ${categories.length}`);

  const products = read<Array<Record<string, unknown> & { variations: Array<Record<string, unknown>> }>>("products.json");
  // Keep existing variation ids stable so carts and past orders keep pointing at the same option.
  const existing = await Product.find({}, { "variations._id": 1, "variations.wpId": 1 }).lean();
  const varIds = new Map(existing.flatMap((p) => p.variations.map((v) => [v.wpId, v._id] as const)));
  products.forEach((p) => p.variations.forEach((v) => varIds.has(v.wpId as number) && (v._id = varIds.get(v.wpId as number))));
  await Product.bulkWrite(
    products.map((p) => ({ updateOne: { filter: { slug: p.slug }, update: { $set: p }, upsert: true } }))
  );
  console.log(`Products: ${products.length}`);

  const site = read<Record<string, unknown>>("site.json");
  await SiteContent.updateOne({ key: "site" }, { $set: { data: site } }, { upsert: true });
  console.log("Site content saved");

  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (ADMIN_EMAIL && ADMIN_PASSWORD) {
    const exists = await User.exists({ email: ADMIN_EMAIL.toLowerCase() });
    if (!exists) {
      await User.create({
        name: "Wolf Admin",
        email: ADMIN_EMAIL,
        role: "admin",
        passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
      });
      console.log(`Admin user created: ${ADMIN_EMAIL}`);
    } else {
      console.log(`Admin user already exists: ${ADMIN_EMAIL}`);
    }
  }

  await Promise.all([Product.syncIndexes(), Category.syncIndexes(), User.syncIndexes()]);
  await mongoose.disconnect();
  console.log("Seed complete ✔");
}

main().catch(async (err) => {
  console.error("Seed failed:", err.message);
  await mongoose.disconnect();
  process.exit(1);
});
