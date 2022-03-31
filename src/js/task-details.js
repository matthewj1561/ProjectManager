import { readAuthToken } from "./utils";

export default class TaskDetails {
    constructor(taskId, services) {
        this.taskId = taskId;
        this.services = services;
        this.token = null;
        this.task = null;
    }

    async init() {
        this.token = readAuthToken();
        if (this.token !== null) {
            this.task = await this.services.getSingleTask(this.token, this.taskId);
            console.log(this.task);
        } else {
            window.location.href = "/login.html";
        }
    }

    fillInfo() {

    }
}