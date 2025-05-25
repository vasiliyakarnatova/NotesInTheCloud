const { Model } = require('objection');

const User = require('./user');
const Note = require('./note');
const Notification = require('./notification');

class Reminder extends Model{
    static get tableName() {
        return 'reminder';
    }

    static get idColumn() {
        return 'reminderId';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['reminderId', 'noteId', 'remindTime', 'description', 'reminderCreater'],
            properties: {
                reminderId: { type: 'string', format: 'uuid' },
                noteId: { type: 'string', format: 'uuid' },
                remindTime: { type: 'string', format: 'date-time' },
                description: { type: 'string' },
                reminderCreater: { type: 'string' }
            }
        };
    }

    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'reminder.remindCreater',
                    to: 'user.userName'
                }
            },

            note: {
                relation: Model.BelongsToOneRelation,
                modelClass: Note,
                join: {
                    from: 'reminder.noteId',
                    to: 'note.noteId'
                }
            },

            notification: {
                relation: Model.HasOneRelation,
                modelClass: Notification,
                join: {
                    from: 'reminder.reminderId',
                    to: 'notification.reminderId'
                }
            }

        };
    }
}

module.exports = Reminder;