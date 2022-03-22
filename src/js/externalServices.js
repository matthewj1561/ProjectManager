import { defaultListOfTasks } from "./taskModel";

const TESTING = false; // Set to false if using API directly

// This url is supposed to go to the API from the backend team
const baseURL = "https://cse341-wdd330-task-manager.herokuapp.com/";

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

    if (!TESTING) {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      };
      response = await fetch(baseURL + "login", options).then(
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
    let successfulSignup = true;

    if (!TESTING) {
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      };
      const successfulSignup = await fetch(baseURL + "signup", options).then(
        // Test connection
        convertToJson
      );
    }

    return successfulSignup;
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

    if (!TESTING) {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      response = await fetch(baseURL + "tasks", options).then(
        convertToJson
      );
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
    let logoutSuccessful = true;

    if (!TESTING) {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      logoutSuccessful = await fetch(baseURL + "logout", options).then(
        convertToJson
      );
    }

    return logoutSuccessful;
  }
}
