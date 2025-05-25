const { Model } = require('objection');

const User = require('./user');
const Note = require('./note');

class Editor extends Model{
    static get tableName() {
        return 'editor';
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
                    from: 'editor.name',
                    to: 'user.userName'
                }
            },

            note: {
                relation: Model.BelongsToOneRelation,
                modelClass: Note, 
                join: {
                    from: 'editor.noteId',
                    to: 'note.noteId'
                }
            }
        };
    }
}

module.exports = Editor;