//const URL = "https://renzcph.dk/fullstack";
const URL = "http://localhost:8080/fullstack_spa";

function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() });
  }
  return res.json();
}

function apiFacade() {
  const setToken = token => {
    localStorage.setItem("jwtToken", token);
  };
  const getToken = () => {
    return localStorage.getItem("jwtToken");
  };
  const getRole = () => {
    let jwt = localStorage.getItem("jwtToken");
    let jwtData = jwt.split(".")[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJwtData = JSON.parse(decodedJwtJsonData);
    return decodedJwtData.roles;
  };

  const getUser = () => {
    let jwt = localStorage.getItem("jwtToken");
    let jwtData = jwt.split(".")[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJwtData = JSON.parse(decodedJwtJsonData);
    return decodedJwtData;
  };
  const loggedIn = () => {
    const loggedIn = getToken() != null;
    return loggedIn;
  };
  const logout = () => {
    localStorage.removeItem("jwtToken");
  };

  const login = (user, password) => {
    const options = makeOptions("POST", true, {
      username: user,
      password: password
    });
    return fetch(URL + "/api/login", options)
      .then(handleHttpErrors)
      .then(res => {
        setToken(res.token);
      });
  };

  const fetchData = () => {
    const options = makeOptions("GET", true); //True add's the token
    if (getRole() === "admin") {
      return fetch(URL + "/api/info/admin", options).then(handleHttpErrors);
    }
    return fetch(URL + "/api/info/user", options).then(handleHttpErrors);
  };

  const fetchPeople = () => {
    const options = makeOptions("GET", true); //True add's the token
    return fetch(URL + "/api/info/user/people", options).then(handleHttpErrors);
  };

  const makeOptions = (method, addToken, body) => {
    var opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json"
      }
    };
    if (addToken && loggedIn()) {
      opts.headers["x-access-token"] = getToken();
    }
    if (body) {
      opts.body = JSON.stringify(body);
    }
    return opts;
  };

//dette er fetch for at hele alle info om courses
  const fetchAllDataAboutCourse = () => {
    const options = makeOptions("GET", true);
    return fetch(URL + "/api/school/all", options).then(handleHttpErrors);
  }

//dette fetch er til add en course
const fetchAddCourse = (CourseDTO) => {
  const options = makeOptions("POST", true, CourseDTO);
  return fetch(URL + "/api/school/course/add", options).then(handleHttpErrors);
}

//dette er fetch til at slette en course
const fetchCourseToDeleteById = (id) => {
  const options = makeOptions("DELETE", true);
  return fetch(URL + "/api/school/delete/" + id, options).then(handleHttpErrors); 
}

//dette er fetch til at slette en classm
const fetchClassmToDeleteById = (id) => {
  const options = makeOptions("DELETE", true);
  return fetch(URL + "/api/school/delete/classm/" + id, options).then(handleHttpErrors);
}
  return {
    makeOptions,
    setToken,
    getToken,
    loggedIn,
    login,
    logout,
    fetchData,
    getRole,
    fetchPeople,
    getUser,
    fetchAllDataAboutCourse,
    fetchCourseToDeleteById,
    fetchClassmToDeleteById,
    fetchAddCourse
  };
}
const facade = apiFacade();
export default facade;
