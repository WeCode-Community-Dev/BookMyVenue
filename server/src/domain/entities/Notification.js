export class Notification {
    constructor({
        id = null,
        userId,
        title,
        message,
        isRead = false,
        createdAt = new Date(),
        updatedAt = new Date()
    }){
        this.id = id
        this.userId = userId
        this.title = title
        this.message = message
        this.isRead = isRead
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
}