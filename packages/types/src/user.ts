export interface UserCreatedEvent {
    userId: string;
    email: string;
    name: string;
    role: "USER" | "OWNER";
}
