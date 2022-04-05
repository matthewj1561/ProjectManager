import { readAuthToken } from './utils';
import { addOnClick, saveTask } from './utils';

export default class TaskDetails {
    constructor(taskId, services) {
        this.taskId = parseInt(taskId);
        this.services = services;
        this.token = null;
        this.task = null;
        this.tasks = null;
        this.creator = 'No Name';
        this.assigned_to = '---';
    }

    async init() {
        const acceptBtn = document.getElementById('accept');
        addOnClick(acceptBtn, this.addUsertoTask.bind(this));

        this.token = readAuthToken();
        if (this.token !== null) {
            // this.task = await this.services.getSingleTask(this.token, this.taskId);
            this.tasks = await this.services.getAllTasks(this.token);

            this.tasks.forEach((task) => {
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
        infoElements[2].innerHTML = `Date Created: ${this.task.date_created}`;
        infoElements[3].innerHTML = `Date Due: ${this.task.due_date}`;
        infoElements[4].innerHTML = `Status: ${this.task.status}`;
        infoElements[5].innerHTML = `Request by: ${this.creator}`;
        infoElements[6].innerHTML = `Assigned to: ${this.assigned_to}`;
        infoElements[7].innerHTML = `Priority: ${this.task.priority}`;
    }

    addUsertoTask() {
        let immutable = false;
        for (let i = 0; i < this.tasks.slice(0, 6).length; i++) {
            if (this.task._id == this.tasks[i]._id) {
                immutable = true;
                alert('This task is immutable');
            }
        }
        if (!immutable) {
            this.task.assigned_to = parseInt(
                localStorage.getItem('task-user-id')
            );
            saveTask(this.task);
            window.location.reload();
        }
    }
}
