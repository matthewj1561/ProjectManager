import { readAuthToken } from './utils';

export default class TaskDetails {
    constructor(taskId, services) {
        this.taskId = parseInt(taskId);
        this.services = services;
        this.token = null;
        this.task = null;
        this.creator = 'No Name';
        this.assigned_to = '---';
    }

    async init() {
        this.token = readAuthToken();
        if (this.token !== null) {
            // this.task = await this.services.getSingleTask(this.token, this.taskId);
            let tasks = await this.services.getAllTasks(this.token);

            tasks.forEach((task) => {
                if (task._id == this.taskId) {
                    this.task = task;
                }
            });

            // Get creator
            const creatorObj = await this.services.getUser(
                this.token,
                this.task.creator_user_id
            );
            this.creator = creatorObj.first + ' ' + creatorObj.last;

            // Get assignee
            if (this.task.assigned_to !== null) {
                const assigneeObj = await this.services.getUser(
                    this.token,
                    this.task.assigned_to
                );
                this.assigned_to = assigneeObj.first + ' ' + assigneeObj.last;
            }
            this.fillInfo();
        } else {
            window.location.href = '/login.html';
        }
    }

    fillInfo() {
        const infoElements = document.querySelectorAll('.task-info');
        infoElements[0].innerHTML = this.task.title;
        infoElements[1].innerHTML = this.task.description;
        infoElements[2].innerHTML += this.task.date_created;
        infoElements[3].innerHTML += this.task.due_date;
        infoElements[4].innerHTML += this.task.status;
        infoElements[5].innerHTML += this.creator;
        infoElements[6].innerHTML += this.assigned_to;
        infoElements[7].innerHTML += this.task.priority;
    }
}
