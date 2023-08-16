import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUri } from '../../../const'
import './index.scss';

const Login = () => {

  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsername = (e) => {
    const value = e.target.value;
    setUsername(value);
  }

  const handlePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
  }

  const executeLogin = async () => {
    const response = await fetch(`${baseUri}/login`, {
      credentials:'include',
      mode: "cors",
      method: "POST",
      headers: {
          "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    })

    const json = await response.json()

    if (json.result !== true) {
      alert('ユーザー名またはパスワードが違います');
      return;
    }

    sessionStorage.setItem('username', username);
    navigate('/WeightInput');
  }
  
  return (
    <div className='login'>
      <h2 className='login__title'>アプリケーションタイトル</h2>
      <input className='login__input'
             type='text'
             value={ username }
             onChange={ handleUsername }
             placeholder='ユーザー名'/>
      <input className='login__input'
             type='password'
             value={ password }
             onChange={ handlePassword }
             placeholder='パスワード'/>
      <button className='login__button' onClick={ executeLogin }>ログイン</button>
    </div>
  );
}

export default Login;