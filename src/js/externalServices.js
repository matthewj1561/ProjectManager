import { defaultListOfTasks } from "./taskModel";

const TESTING = true; // Set to false if using API directly

// This url is supposed to go to the API from the backend team
const baseURL = "https://cse341-wdd330-task-manager.herokuapp.com/";
// const baseURL = "http://localhost:8080/";

// A collection of mock urls to test points of the site
const signupTestURL = "https://ezmock.herokuapp.com/api/623a05f4fa803c0015c625ea";
const loginTestURL = "https://run.mocky.io/v3/29bd5f9e-a0ac-4ba0-9219-ce44ee001501";
const allTasksTestURL = "https://run.mocky.io/v3/bbbee1b4-2427-4424-929d-b4332e839754";
const singleTaskTestURL = "https://run.mocky.io/v3/2a4db3d0-4536-40d9-b6fd-47a4caf1a6e6";
const logoutTestURL = "";
const getUserURL = "https://run.mocky.io/v3/13c5b982-4841-4b8a-8544-8cb35871ec70";

async function convertToJson(res) {
  const jsonResponse = await res.json();

  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'servicesError', message: jsonResponse };
  }
}

// Inside here is how we do all communications with the backend team
export default class ExternalServices {
  constructor() {}

  /**
   * LOGIN REQUEST
   * Makes a POST request to url/login using user credentials
   * 
   * @param {{email: string, password: string}} user 
   * @returns string of the access token
   */
  async loginRequest(user) {
    let response = {accessToken: 1234};

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    };
    if (!TESTING) {
      response = await fetch(baseURL + "login", options).then(
        convertToJson
        );
    } else {
      response = await fetch(loginTestURL).then(
        convertToJson
      );
    }

    return response;
  }

  /**
   * SIGNUP REQUEST
   * 
   * Sends a PUT request to url/signup to try adding user to API
   * 
   * @param {{email: string, password: string, confirm: string, company: string}} user 
   * @returns True if successful, False otherwise
   */
  async signupRequest(user) {
    let responseInfo = { "signupSuccess": false, "errorMessage": "" };

    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    };
    if (!TESTING) {
      await fetch(baseURL + "signup", options).then(response => {
        response = convertToJson(response);
        if (typeof response === 'string') {
          responseInfo.signupSuccess = true;
        } else {
          responseInfo.errorMessage = "Fill out all the information please";
        }
      });
    } else {
      responseInfo.signupSuccess = true;
    }

    return responseInfo;
  }

  /**
   * GET ALL TASKS
   * 
   * Sends a GET request to url/tasks to get all task info
   * 
   * @param {string} token 
   * @returns array of tasks
   */
  async getAllTasks(token) {
    let response = defaultListOfTasks;

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    if (!TESTING) {
      response = await fetch(baseURL + "tasks", options).then(
        convertToJson
      );
    } else {
      response = await fetch(allTasksTestURL).then(convertToJson)
    }

    return response;
  }

  /**
   * LOGOUT
   * 
   * Sends a POST request to url/logout to logout the user
   * 
   * @param {string} token 
   * @returns True for successful logout, False otherwise
   */
  async logout (token) {
    let response = { "logoutSuccess": false };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    if (!TESTING) {
      response = await fetch(baseURL + "logout", options).then(
        convertToJson
      );
    } else {
      response = await fetch(logoutTestURL).then(convertToJson)
    }

    return response.logoutSuccess;
  }

  async getUser(token, id) {
    let response = null;

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(id),
    };
    if (!TESTING) {
      response = await fetch(baseURL + "user", options).then(
        convertToJson
      );
    } else {
      response = await fetch(getUserURL).then(convertToJson)
    }

    return response;
  }

  async getSingleTask(token, taskId) {
    let response = null;

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    if (!TESTING) {
      response = await fetch(baseURL + "task?task=" + taskId, options).then(
        convertToJson
      );
    } else {
      response = await fetch(singleTaskTestURL).then(convertToJson)
    }

    return response;
  }
}
