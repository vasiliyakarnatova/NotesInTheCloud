const { Model } = require('objection');

class User extends Model{

    static get tableName() {
        return 'user';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['userName', 'password', 'email'],
            properties: {
                userName: {type: 'string'},
                password: {type: 'string'},
                email: {type: 'string'},
            },
        };
    }

    static get relationMappings() {
        const Editor = require('./editor');
        const Note = require('./note');
        const Reminder = require('./reminder');

        return{
            notes: {
                relation: Model.HasManyRelation,
                modelClass: Note,
                join: {
                    from: 'user.userName',
                    to: 'note.author'
                }
            },

            editor: {
                relation: Model.HasManyRelation,
                modelClass: Editor,
                join: {
                    from: 'user.userName',
                    to: 'editor.name'
                }
            },

            reminder: {
                relation: Model.HasManyRelation,
                modelClass: Reminder,
                join: {
                    from: 'user.userName',
                    to: 'reminder.remindCreater'
                }
            }
        };
    }
}

module.exports = User; 