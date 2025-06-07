const { Model } = require('objection');

const User = require('./user')

class Notification extends Model{
    static get tableName() {
        return 'notification';
    }

    static get idColumn() {
        return 'notificationId';
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