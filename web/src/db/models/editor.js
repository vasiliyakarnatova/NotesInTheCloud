const { Model } = require('objection');

// import knexInstance from '../knexConnection';  

// Model.knex(knexInstance);

class Editor extends Model{
    static get tableName() {
        return 'editor';
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
        const User = require('./user');
        const Note = require('./note');

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