export class Task {
    constructor() {
        this._id = "1";
        this.title = "Big Task";
        this.description = "It's a big task";
        this.date_created = "4/1/2022";
        this.due_date = "4/1/2023";
        this.status = "unassigned";
        this.creator_user_id = "0";
        this.priority = "low";
    }
}

export const defaultListOfTasks = [
    new Task(),
    new Task(),
    new Task()
]