const { Model } = require('objection');

const Editor = require('./editor');
const Note = require('./note');
const Reminder = require('./reminder');

class User extends Model{

    static get tableName() {
        return 'users';
    }

    static get idColumn() {
        return 'userName';
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
        return{
            notes: {
                relation: Model.HasManyRelation,
                modelClass: Note,
                join: {
                    from: 'users.userName',
                    to: 'notes.author'
                }
            },

            editor: {
                relation: Model.HasManyRelation,
                modelClass: Editor,
                join: {
                    from: 'users.userName',
                    to: 'editors.name'
                }
            },

            reminder: {
                relation: Model.HasManyRelation,
                modelClass: Reminder,
                join: {
                    from: 'users.userName',
                    to: 'reminders.remindCreater'
                }
            }
        };
    }
}

module.exports = User; 