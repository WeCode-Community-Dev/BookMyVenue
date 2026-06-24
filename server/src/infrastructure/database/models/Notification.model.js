import mongoose from 'mongoose'

const notificationSchema =

    new mongoose.Schema(

        {
            userId: {
                type: String,
                required: true
            },

            title: {
                type: String,
                required: true
            },

            message: {
                type: String,
                required: true
            },

            isRead: {
                type: Boolean,
                default: false
            }

        },

        {
            timestamps: true
        }

    )

export default mongoose.model('Notification', notificationSchema)