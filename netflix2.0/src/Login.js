import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [response, setResponse] = useState(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  let onChangeEmail = (e) => setEmail(e.target.value);
  let onChangeSenha = (e) => setSenha(e.target.value);

  let handleLogin = (shouldRedirect = false) => {
    if (!email || !senha) {
      alert('Please enter both email and password');
      return;
    }
    axios.post("http://localhost:3001/login", { email, senha })
      .then(resp => {
        if (resp?.data?.sessionID) {
          sessionStorage.setItem("sessionID", resp.data.sessionID);
          if (shouldRedirect) {
            navigate('home');
          }
        }
      })
      .catch(error => console.log(error));
  }

  let testar = () => {
    axios.post("http://localhost:3001/test", {
      sessionID: sessionStorage.getItem("sessionID")
    }).then(resp => {
      setResponse(resp);
      console.log(resp.data);
    }).catch(error => console.log(error));
  }

  return (
    <div className="App">
      <header className="App-header">
        <label>Email:</label>
        <input type="email" onChange={onChangeEmail} value={email} />
        <label>Senha:</label>
        <input type="password" onChange={onChangeSenha} value={senha} />

        <button onClick={() => handleLogin(false)}>Logar</button>
        <button onClick={testar}>Testar</button>
        <button onClick={() => handleLogin(true)}>Entrar</button>

        {response && <div>{JSON.stringify(response.data)}</div>}
      </header>
    </div>
  );
}

export default Login;
