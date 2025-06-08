const { Model } = require('objection');

const User = require('./user');
const Note = require('./note');

class Editor extends Model{
    static get tableName() {
        return 'editors';
    }

    static get idColumn() {
        return ['noteId', 'name'];
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['noteId', 'name'],
            properties: {
                noteId: { type: 'string', format: 'uuid' },
                name: { type: 'string' }
            }
        };
    }

    static get relationMappings() {
        return{
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'editors.name',
                    to: 'users.userName'
                }
            },

            note: {
                relation: Model.BelongsToOneRelation,
                modelClass: Note, 
                join: {
                    from: 'editors.noteId',
                    to: 'notes.noteId'
                }
            }
        };
    }
}

module.exports = Editor;