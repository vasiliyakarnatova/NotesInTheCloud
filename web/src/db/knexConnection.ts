const knex = require('knex');
const knexfile = require('./knexfile'); 

const knexInstance = knex(knexfile.development);

const { Model } = require('objection');
Model.knex(knexInstance); 

export default knexInstance; 
