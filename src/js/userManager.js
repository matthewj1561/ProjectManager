import ExternalServices from "../js/externalServices";
import { readAuthToken, renderListWithTemplate, saveAuthToken, addOnClick } from "./utils.js";

export default class UserManager {
  constructor(filterSelector, listSelector) {
    this.filterElement = document.getElementById(filterSelector);
    this.listElement = document.getElementById(listSelector);
    this.token = null;
    this.services = new ExternalServices();
    this.taskList = [];
    this.activeFilter = ""
  }

  async init() {
    this.token = readAuthToken();
    if (this.token !== null) {
        this.taskList = await this.services.getAllTasks(this.token);
        this.showTaskList(this.taskList);
    } else {
        // If they aren't logged in, send them to login page
        window.location.href = "/login.html";
    }
    
  }

  showUserTabs() {
    const display = `
    <ul>
      <li class="active" id="currentTasks">My Ongoing Tasks</li>
      <li id="allMyTasks">All My Tasks</li>
      <li id="unassignedTasks">Unassigned Tasks</li>
      <li id="myRequests">My Task Requests</li>
    </ul>`;

    this.filterElement.innerHTML = display;
  }

  showTaskList(filteredTasks) {
    const template = document.getElementById("task-template");
    
    renderListWithTemplate(template, this.listElement, filteredTasks, this.fillTaskThumbnail);
  }

  fillTaskThumbnail(element, task) {
    element.querySelector(".title").innerHTML = task.title;
    element.querySelector(".priority").innerHTML += task.priority;
    element.querySelector(".due-date").innerHTML += task.due_date;

    element.querySelector(".task-display").href += task._id;

    return element;
  }


}
