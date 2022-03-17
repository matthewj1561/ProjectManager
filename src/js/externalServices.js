import { defaultListOfTasks } from "./taskModel";

// This url is supposed to go to the API from the backend team
const baseURL = "//157.201.228.93:2992/";

async function convertToJson(res) {
  const jsonResponse = await res.json();

  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'servicesError', message: jsonResponse };
    // console.log("Oops");
    }
}

// Inside here is how we do all communications with the backend team
export default class ExternalServices {
  constructor() {}

//   async findProductById(id) {
//     // const products = await this.getData();
//     // return products.find((item) => item.Id === id);
//     return fetch(baseURL + `product/${id}`)
//       .then(convertToJson)
//       .then((data) => data.Result);
//   }

//   getData(category) {
//     return fetch(baseURL + `products/search/${category}`)
//       .then(convertToJson)
//       .then((data) => data.Result);
//   }

//   async checkout(payload) {
//     const options = {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     };

//     // const thing1 = await fetch(baseURL + "checkout/", options);
//     return await fetch(baseURL + "checkout/", options).then(convertToJson);
//   }

  // A user (a JS object consisting of email and password fields) is used to request an accessToken from the API
  async loginRequest(user) {
    /* const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    };
    const response = await fetch(baseURL + "login", options).then(
      convertToJson
    ); */

    const response = {accessToken: 1234};

    return response.accessToken;
  }

  // A user (a JS object consisting of email, password, confirm, and company fields)
  // is used to request an accessToken from the API
  async signupRequest(user) {
    /* const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    };
    const response = await fetch(baseURL + "signup", options).then(
      convertToJson
    ); */

    const response = {accessToken: 5678};

    return response.accessToken;
  }

  // The user gives token to the API, which gets the correct users' company's tasks
  async getAllTasks(token) {
    /* const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(baseURL + "tasks", options).then(
      convertToJson
    );
    */

    const response = defaultListOfTasks;

    return response;
  }
}
