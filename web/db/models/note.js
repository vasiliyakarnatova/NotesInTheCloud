const { Model } = require('objection');

const User = require('./user');
const Editor = require('./editor');
const TodoItem = require('./todoItem');
const Reminder = require('./reminder');

class Note extends Model{
    static get tableName() {
        return 'notes';
    }

    static get idColumn() {
        return 'noteId';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['noteId', 'title', 'author'],
            properties: {
                noteId: { type: 'string', format: 'uuid' },
                title: { type: 'string' },
                description: { type: 'string' },
                author: { type: 'string' },
                created_at: { type: 'string', format: 'date-time' },
                updated_at: { type: 'string', format: 'date-time' }
            }
        };
    }

    static get relationMappings() {
        return {
            users: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'notes.author',
                    to: 'users.userName'
                }
            },

            editors: {
                relation: Model.HasManyRelation,
                modelClass: Editor,
                join: {
                    from: 'notes.noteId',
                    to: 'editors.noteId'
                }
            },

            todoItems: {
                relation: Model.HasManyRelation,
                modelClass: TodoItem,
                join: {
                    from: 'notes.noteId',
                    to: 'todoItems.noteId'
                }
            },

            reminder: {
                relation: Model.HasManyRelation,
                modelClass: Reminder,
                join: {
                    from: 'notes.noteId',
                    to: 'reminders.noteId'
                }
            }
        };
    }

}

module.exports = Note;