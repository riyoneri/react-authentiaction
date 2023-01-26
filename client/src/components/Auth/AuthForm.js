import { useState, useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';

import { useHistory } from 'react-router-dom'

import classes from './AuthForm.module.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState({
    isError: false,
    message: ''
  })

  const history = useHistory()

  const authCtx = useContext(AuthContext)

  const emailInputRef = useRef();
  const passwordInputRef = useRef()

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const inputChangeHandler = () => {
    setErrorMessage({
      isError: true,
      message: ''
    })
  }

  const submitHandler = async event => {
    event.preventDefault();
    const requestUrl = isLogin ? '/auth/login' : '/auth/register'

    const enteredEmail = emailInputRef.current.value
    const enteredPassword = passwordInputRef.current.value

    if (isLogin) {
      const result = await fetch(requestUrl, {
        method: "post",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword
        })
      })

      const data = await result.json()

      if (!result.ok) {
        return setErrorMessage({
          isError: true,
          message: data.message || 'An Error Occured'
        })
      }
      const expirationTime = new Date(new Date().getTime() + +data.tokenData.expirationTime)
      authCtx.login(data.tokenData.token, expirationTime.toISOString())
      history.replace('/')

    } else {
      try {
        const result = await fetch(requestUrl, {
          method: "post",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword
          })
        })

        const data = await result.json()

        if (!result.ok) {
          return setErrorMessage({
            isError: true,
            message: data.message || 'An Error Occured'
          })
        }

        setIsLogin(true)

        setErrorMessage({
          isError: true,
          "message": 'Register successful now login'
        })

        const messageTimeout = setTimeout(() => {
          setErrorMessage({ isError: false })
          clearTimeout(messageTimeout)
        }, 3000);

      }
      catch {
        setErrorMessage({
          isError: true,
          message: 'An Error Occured while sending datas, try again!'
        })
      }

    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form>
        {errorMessage.isError &&
          <div className={classes.control}>
            <label>{errorMessage.message}</label>
          </div>
        }
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' onChange={inputChangeHandler} required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' onChange={inputChangeHandler} required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          <button onClick={submitHandler}>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
