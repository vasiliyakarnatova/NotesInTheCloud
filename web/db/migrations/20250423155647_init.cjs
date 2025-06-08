/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) { 
  return knex.schema
    .createTable('users', (table) => {
      table.string('userName').primary();
      table.string('password').notNullable();
      table.string('email').notNullable().unique();
    })
    .createTable('notes', (table) => { 
      table.uuid('noteId').defaultTo(knex.raw('gen_random_uuid()')).primary();
      table.string('title').notNullable();
      table.string('description');
      table.string('author').notNullable().references('userName').inTable('users');
      table.timestamps(true, true);
    })
    .createTable('editors', (table) => {
      table.uuid('noteId').notNullable().references('noteId').inTable('notes');
      table.string('name').notNullable().references('userName').inTable('users');
      table.primary(['noteId', 'name']);
    })
    .createTable('todoItems', (table) => {
      table.uuid('todoItemId').defaultTo(knex.raw('gen_random_uuid()')).primary();
      table.string('todoItemTitle').notNullable();
      table.boolean('isChecked').notNullable();
      table.uuid('noteId').notNullable().references('noteId').inTable('notes');
      table.timestamp('createdTime').defaultTo(knex.fn.now());
    })
    .createTable('reminders', (table) => {
      table.uuid('reminderId').defaultTo(knex.raw('gen_random_uuid()')).primary();
      table.uuid('noteId').notNullable().references('noteId').inTable('notes');
      table.string('reminderCreater').notNullable().references('userName').inTable('users');
      table.timestamp('remindTime').notNullable();
      table.string('description').notNullable();
    })
    .createTable('notifications', (table) => {
      table.uuid('notificationId').defaultTo(knex.raw('gen_random_uuid()')).primary();
      table.uuid('remindId').notNullable().references('reminderId').inTable('reminders');
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
    .dropTableIfExists('notifications')
    .dropTableIfExists('reminders')
    .dropTableIfExists('todoItems')
    .dropTableIfExists('editors')
    .dropTableIfExists('notes')
    .dropTableIfExists('users');
};

