import "./App.css";
import React, { useState, useEffect } from "react";
import facade from "./apiFacade";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Switch,
  Route,
  useRouteMatch,
  useParams,
  Link,
  Prompt,
  NavLink,
  useHistory
} from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  let history = useHistory();

  const logout = () => {
    facade.logout();
    setLoggedIn(false);
    history.push("/");
  };
  const login = (user, pass) => {
    facade.login(user, pass).then(res => setLoggedIn(true));
    history.push("/");
  };

  return (
    <div>
      {!loggedIn ? (
        <div>
          <HeaderStart />
          <ContentStart login={login} />
        </div>
      ) : (
          <div>
            <LoggedIn logout={logout} />
          </div>
        )}
    </div>
  );
}

function LogIn({ login }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);

  const performLogin = evt => {
    evt.preventDefault();
    login(loginCredentials.username, loginCredentials.password);
  };
  const onChange = evt => {
    setLoginCredentials({
      ...loginCredentials,
      [evt.target.id]: evt.target.value
    });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onChange={onChange}>
        <input placeholder="User Name" id="username" />
        <input placeholder="Password" id="password" />
        <button onClick={performLogin}>Login</button>
      </form>
    </div>
  );
}
const Logout = ({ logout }) => {
  const handleLogout = () => {
    logout();
  };
  return (
    <div>
      <h2>Logout</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

function LoggedIn({ logout }) {
  return (
    <div>
      <Header />
      <Content logout={logout} />
    </div>
  );
}
const HeaderStart = () => {
  return (
    <ul className="header">
      <li>
        <NavLink exact activeClassName="active" to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/courses">
          Courses
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/login">
          Login
        </NavLink>
      </li>
    </ul>
  );
};
const ContentStart = ({ login }) => {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <LogIn login={login} />
      </Route>
      <Route path="/Courses">
        <Courses />
      </Route>
      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
};
const Header = () => {
  if (facade.getRole() === "admin") {
    return (
      <ul className="header">
        <li>
          <NavLink exact activeClassName="active" to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/people">
            People
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/courses">
            Courses
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/edit">
            Edit
          </NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/logout">
            Logout
          </NavLink>
        </li>
        <li style={{ float: "right" }}>
          <NavLink activeClassName="active" to="/user-info">
            Hi! {facade.getUser().username} Role: {facade.getUser().roles}
          </NavLink>
        </li>
      </ul>
    );
  }
  return (
    <ul className="header">
      <li>
        <NavLink exact activeClassName="active" to="/">
          Home
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/people">
          People
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/Courses">
          Courses
        </NavLink>
      </li>
      <li>
        <NavLink activeClassName="active" to="/logout">
          Logout
        </NavLink>
      </li>
    </ul>
  );
};

const Content = ({ logout }) => {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/people">
        <People />
      </Route>
      <Route path="/courses">
        <Courses />
      </Route>
      <Route path="/edit">
        <Edit />
      </Route>
      <Route path="/logout">
        <Logout logout={logout} />
      </Route>
      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
};

const Home = () => {
  return (
    <div>
      <h3>Welcome to home</h3>
    </div>
  );
};

const People = () => {
  const [dataFromServer, setDataFromServer] = useState("Fetching...");
  const [listPeople, setListPeople] = useState([]);

  useEffect(() => {
    facade.fetchData().then(res => setDataFromServer(res.msg));
  }, []);
  useEffect(() => {
    let didCancel = false;
    facade.fetchPeople().then(res => {
      if (didCancel === false) {
        setListPeople(res);
        console.log("Fetching complete");
      }
    });
    return () => {
      didCancel = true;
    };
  }, []);
  return (
    <div>
      <h2>Data Received from server</h2>
      <h3>{dataFromServer}</h3>
      <p>{JSON.stringify(listPeople)}</p>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Height</th>
            <th>Gender</th>
          </tr>
        </thead>
        <tbody>
          {listPeople.map((person, index) => {
            return (
              <tr key={index}>
                <td>{person.name}</td>
                <td>{person.height}</td>
                <td>{person.gender}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Edit = () => {
  return (
    <div>
      <h3>Find and Edit</h3>
    </div>
  );
};


const Course = () => {
  const [listCourse, setListCourse] = useState([]);
  useEffect(() => {
    facade.fetchAllDataAboutCourse().then(res => setListCourse(res));
  }, []);
return(
  <div>
    <h2>this shows the data of all info about courses</h2>
<p>{JSON.stringify(listCourse)}</p>
  </div>
)
};

const Courses = ({listCourse}) => {
  return (
    <div className="col-md-8">
      <h3>Information site for Courses</h3>
      <table>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Course Description</th>
          </tr>
        </thead>
        <tbody>
          {listCourse.map((course, index) => {
            return (
            <tr key={index}>
          <td>{course.name}</td>
            </tr>
            );
          })}
        </tbody>
      </table>

    </div>
  );
};

const NoMatch = () => <div>Urlen matcher ingen kendte routes</div>;
export default App;
