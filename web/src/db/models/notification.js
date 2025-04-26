const { Model } = require('objection');

// import knexInstance from '../knexConnection';  

// Model.knex(knexInstance);

class Notification extends Model{
    static get tableName() {
        return 'notification';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['notificationId', 'remindId', 'sentAt', 'isRead'],
            properties: {
                notificationId: { type: 'string', format: 'uuid' },
                remindId: { type: 'string', format: 'uuid' },
                sentAt: { type: 'string', format: 'date-time' },
                isRead: { type: 'boolean'}
            }
        };
    }

    static get relationMappings() {
        const Reminder = require('./reminder');
        const User = require('./user')

        return{
            reminder: {
                relation: Model.HasOneThroughRelation,
                modelClass: User,
                join: {
                    from: 'notification.remindId',
                    through: {
                        from: 'reminder.reminderId',
                        to: 'reminder.reminderCreater'
                    },
                    to: 'user.userName'
                }
            }
        };
    }
}

module.exports = Notification;