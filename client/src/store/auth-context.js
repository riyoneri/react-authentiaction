import React, { useState } from 'react'

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: token => { },
    logout: () => { }
})

export const AuthContextProvider = props => {
    const authToken = localStorage.getItem('a_t')
    const [token, setToken] = useState(authToken)

    const userLoggedIn = !!token;

    const loginHandler = token => {
        setToken(token)
        localStorage.setItem('a_t', token)
    }

    const logoutHandler = () => {
        setToken(null)
        localStorage.removeItem('a_t')
    }

    const contextValue = {
        token: token,
        isLoggedIn: userLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    }

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
}

export default AuthContext