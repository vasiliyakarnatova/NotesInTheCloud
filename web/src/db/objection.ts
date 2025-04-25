import { Model } from 'objection';
import Knex from 'knex';
export default function objj() {
try {
    const knexConfig = require('./knexfile');
    const knex = Knex(knexConfig.development);
    Model.knex(knex);
    console.log("Database connected successfully ✅");
} catch (err) {
    console.error("❌ Failed to initialize knex/objection:", err);
}
}