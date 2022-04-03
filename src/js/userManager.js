import ExternalServices from "../js/externalServices";
import { readAuthToken, renderListWithTemplate, saveAuthToken, addOnClick, createNewElement, readId } from "./utils.js";

export default class UserManager {
  constructor(filterSelector, listSelector) {
    this.filterElement = document.getElementById(filterSelector);
    this.listElement = document.getElementById(listSelector);
    this.token = null;
    this.user = {};
    this.services = new ExternalServices();
    this.taskList = [];
    this.activeFilter = ""
  }

  async init() {
    this.token = readAuthToken();
    if (this.token !== null) {
        this.taskList = await this.services.getAllTasks(this.token);
        const myId = { "_id": readId() };
        this.user = await this.services.getUser(this.token, myId);
        this.myTaskFilter();
    } else {
        // If they aren't logged in, send them to login page
        window.location.href = "/login.html";
    }
    
  }

  showUserTabs() {
    const myTasks = createNewElement('li', 'filter', 'myTasks', 'My Ongoing Tasks');
    addOnClick(myTasks, this.myTaskFilter.bind(this));
    this.filterElement.append(myTasks);

    const allTasks = createNewElement('li', 'filter', 'allTasks', 'All Company Tasks');
    addOnClick(allTasks, this.allTaskFilter.bind(this));
    this.filterElement.append(allTasks);

    const unclaimedTasks = createNewElement('li', 'filter', 'unclaimedTasks', 'Unclaimed Tasks');
    addOnClick(unclaimedTasks, this.unclaimedTaskFilter.bind(this));
    this.filterElement.append(unclaimedTasks);

    const myRequests = createNewElement('li', 'filter', 'myRequests', 'My Task Requests');
    addOnClick(myRequests, this.myRequestsFilter.bind(this));
    this.filterElement.append(myRequests);
  }

  showTaskList(filteredTasks) {
    // Clear current list first

    this.listElement.innerHTML = "";
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

  updateActiveFilter(filterSelector) {
    const filterList = document.querySelectorAll(".filter");

    filterList.forEach(item => {
      item.classList.remove("active");
    });

    document.querySelector(filterSelector).classList.add("active");
  }


  /********
   * FILTERS
   * 
   * Different filters to narrow down task search
   */

  myTaskFilter() {
    const filteredList = this.taskList.filter(task => task.assigned_to === this.user._id);

    this.updateActiveFilter("#myTasks");

    this.showTaskList(filteredList);
  }

  allTaskFilter() {
    this.updateActiveFilter("#allTasks");

    this.showTaskList(this.taskList);
  }

  unclaimedTaskFilter() {
    const filteredList = this.taskList.filter(task => task.assigned_to === null);

    this.updateActiveFilter("#unclaimedTasks");

    this.showTaskList(filteredList);
  }

  myRequestsFilter() {
    const filteredList = this.taskList.filter(task => task.creator_user_id === this.user._id);

    this.updateActiveFilter("#myRequests");

    this.showTaskList(filteredList);
  }


}
