import { useRef, useContext, useState } from 'react'

import AuthContext from '../../store/auth-context';

import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const passwordInputRef = useRef()
  const authCtx = useContext(AuthContext)

  const [errorMessage, setErrorMessage] = useState({
    isError: false,
    message: ''
  })

  const changePasswordHandler = async event => {
    event.preventDefault();
    const enteredPassword = passwordInputRef.current.value

    try {
      const result = await fetch('/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authCtx.token}`
        },
        body: JSON.stringify({
          password: enteredPassword
        })
      })

      const data = await result.json()
      if (!result.ok) {
        throw new Error(data.message || 'An Error Occured')
      }

      console.log(data)

    } catch (err) {
      setErrorMessage({
        isError: true,
        message: err.message
      })
    }

  }

  return (
    <form className={classes.form}>

      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' required id='new-password' ref={passwordInputRef} />
      </div>
      {errorMessage.isError && <div>
        <label>{errorMessage.message}</label>
      </div>
      }
      <div className={classes.action}>
        <button onClick={changePasswordHandler}>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
