import React, { useEffect, useState, useCallback } from 'react'

let logoutTimer;

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token, expirationTime) => { },
    logout: () => { }
})

const calculateRemainingTime = expirationTime => {
    const currentDate = new Date().getTime()
    const adjExpirationTime = new Date(expirationTime).getTime()

    const remainingDuration = adjExpirationTime - currentDate

    return remainingDuration
}

const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('a_t')
    const storedExpirationTime = localStorage.getItem('e_t')

    const remainingTime = calculateRemainingTime(storedExpirationTime)

    if(remainingTime < 60000){
        return null
    }

    return {
        token: storedToken,
        expirationTime: remainingTime
    }
}

export const AuthContextProvider = props => {
    const tokenData = retrieveStoredToken()
    let authToken;
    if(tokenData) {
        authToken = tokenData.token
    }
    const [token, setToken] = useState(authToken)

    const userLoggedIn = !!token;

    const logoutHandler = useCallback(() => {
        setToken(null)
        localStorage.removeItem('a_t')
        localStorage.removeItem('e_t')

        if(logoutTimer) {
            clearTimeout(logoutTimer)
        }
    }, [])

    const loginHandler = (token, expirationTime) => {
        setToken(token)
        localStorage.setItem('a_t', token)
        localStorage.setItem('e_t', expirationTime)

        const remainingTime = calculateRemainingTime(expirationTime)
        logoutTimer = setTimeout(logoutHandler, remainingTime)
    }

    useEffect(() => {
        if(tokenData) {
            logoutTimer = setTimeout(logoutHandler, tokenData.expirationTime)
        }
    }, [tokenData, logoutHandler])

    const contextValue = {
        token: token,
        isLoggedIn: userLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    }

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
}

export default AuthContext