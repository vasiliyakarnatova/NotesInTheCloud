/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) { 
  return knex.schema
    .createTable('user', (table) => {
      table.string('userName').primary();
      table.string('password').notNullable();
      table.string('email').notNullable();
    })
    .createTable('note', (table) => { 
      table.uuid('noteId').defaultTo(knex.raw('gen_random_uuid()')).primary();
      table.string('title').notNullable();
      table.string('description');
      table.string('author').notNullable().references('userName').inTable('user');
      table.timestamps(true, true);
    })
    .createTable('editor', (table) => {
      table.uuid('noteId').notNullable().references('noteId').inTable('note');
      table.string('name').notNullable().references('userName').inTable('user');
    })
    .createTable('todoItem', (table) => {
      table.uuid('todoItemId').defaultTo(knex.raw('gen_random_uuid()')).primary();
      table.string('todoItemTitle').notNullable();
      table.boolean('isChecked').notNullable();
      table.uuid('noteId').notNullable().references('noteId').inTable('note');
      table.timestamp('createdTime').defaultTo(knex.fn.now());
    })
    .createTable('reminder', (table) => {
      table.uuid('reminderId').defaultTo(knex.raw('gen_random_uuid()')).primary();
      table.uuid('noteId').notNullable().references('noteId').inTable('note');
      table.string('reminderCreater').notNullable().references('userName').inTable('user');
      table.timestamp('remindTime').notNullable();
      table.string('description').notNullable();
    })
    .createTable('notification', (table) => {
      table.uuid('notificationId').defaultTo(knex.raw('gen_random_uuid()')).primary();
      table.uuid('remindId').notNullable().references('reminderId').inTable('reminder');
      table.timestamp('sentAt').defaultTo(knex.fn.now());
      table.boolean('isRead').notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) { 
  return knex.schema
    .dropTableIfExists('todo_Item')
    .dropTableIfExists('notification')
    .dropTableIfExists('reminder')
    .dropTableIfExists('editor')
    .dropTableIfExists('note')
    .dropTableIfExists('user');
};

