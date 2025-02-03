import { useState } from 'react';
import './styles.css';
import MD5 from "crypto-js/md5";

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [userError, setUserError] = useState(false);

  const handleSubmit = async () => {
    event.preventDefault();
    let userid = event.target.parentNode.children[0].children[1].value;
    let password = event.target.parentNode.children[1].children[1].value;
    let hash = MD5(password).toString();

    let result = await fetch("http://localhost:3000/validate", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"userId": userid, "hash": hash}),
    });
    let records = await result.json();
    let data = JSON.parse(records);

    if(data.error && data.error == "Error"){
      setError(true);
    }
    else if(data.error && data.error == "Auth Error"){
      setUserError(true);
    }
    else{
      setData(data);
    }
  }

  const handleClickAgain = () => {
    event.preventDefault();
    setData([]);
    setError(false);
    setUserError(false);
  }

  return (
    <>
    {(data.length == 0) ? 
      (
    <div className="container">
      {error ? (<h2>Something went wrong. Please try again.</h2>): null}
      {userError ? (<h2>Username or Password incorrect.</h2>): null}
      <h1>Sign In</h1>
      <form>
        <div className="input">
          <label type="text" htmlFor="userId">Username: </label>
          <input type="text" name="userId" id="userId" placeholder="admin_test"></input>
        </div>
        <div className="input">
          <label type="text" htmlFor="hash">Password: </label>
          <input type="password" name="hash" id="hash" placeholder="password"></input>
        </div>
        <button onClick={handleSubmit} type="submit">Sign In</button>
      </form>
    </div>)
    :
    (
    <div className="container">
      <h1>Records</h1>
      <table>
        <thead>
          <tr>
            <th>userid</th>
            <th>password_hash</th>
            <th>role</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr key={record.userid}>
              <td>{record.userid}</td>
              <td>{record.password_hash}</td>
              <td>{record.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="submit" onClick={handleClickAgain}>Fetch Again</button>
    </div>)
    }
    </>
  )
}

export default App
