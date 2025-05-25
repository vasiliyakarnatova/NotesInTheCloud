const { Model } = require('objection');

const Note = require('./note');

class TodoItem extends Model {
    static get tableName() {
        return 'todoItem';
    }

    static get idColumn() {
        return 'todoItemId';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['todoItemId', 'todoItemTitle', 'isChecked', 'noteId'],
            properties: {
                todoItemId: { type: 'string', format: 'uuid' },
                todoItemTitle: { type: 'string' },
                isChecked: { type: 'boolean' },
                noteId: { type: 'string', format: 'uuid' },
                createdTime: { type: 'string', format: 'date-time' }
            }
        };
    }

    static get relationMappings() {
        return {
            note: {
                relation: Model.BelongsToOneRelation,
                modelClass: Note,
                join: {
                    from: 'todoItem.noteId',
                    to: 'note.noteId'
                }
            }
        };
    }
}

module.exports = TodoItem;