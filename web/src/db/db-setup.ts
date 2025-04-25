const knex = require('knex');
const knexfile = require('./knexfile');
const { Model } = require('objection');

function setupDb() {
    console.log("I am in SetupDB!");
    const db = knex(knexfile.development);
    Model.knex(db);

    console.log("Just finished SetupDB!");
}

export default setupDb;