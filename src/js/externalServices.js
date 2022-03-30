import { defaultListOfTasks } from "./taskModel";

const TESTING = true; // Set to false if using API directly

// This url is supposed to go to the API from the backend team
const baseURL = "https://cse341-wdd330-task-manager.herokuapp.com/";

// A collection of mock urls to test points of the site
const signupTestURL = "https://ezmock.herokuapp.com/api/623a05f4fa803c0015c625ea";
const loginTestURL = "https://run.mocky.io/v3/29bd5f9e-a0ac-4ba0-9219-ce44ee001501";
const allTasksTestURL = "https://run.mocky.io/v3/23136aa1-7371-47a8-b378-54886e8f6aea";
const singleTaskTestURL = "https://run.mocky.io/v3/2a4db3d0-4536-40d9-b6fd-47a4caf1a6e6";
const logoutTestURL = "";

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

    return response.accessToken;
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
    let response = { "signupSuccess": false };

    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    };
    if (!TESTING) {
      response = await fetch(baseURL + "signup", options).then(
        // Test connection
        convertToJson
      );
    } else {
      response = await fetch(signupTestURL).then(convertToJson)
    }

    return response.signupSuccess;
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
}
