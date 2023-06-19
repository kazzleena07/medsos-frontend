import request from './httpclient'

function Login(userinfo) {
    return request({
        url: 'auth/signin',
        method: 'POST',
        data: userinfo
    }, false, "application/json")
}

function CheckUserExist(userinfo) {
    return request({
        url: 'auth/checkUserExist',
        method: 'POST',
        data: userinfo
    }, false, "application/json")
}

function Logout() {
    return request({
        url: 'auth/signout',
        method: 'POST'
    })
}

function SignUp(userinfo) {
    return request({
        url: 'auth/signup',
        method: 'POST',
        data: userinfo
    }, false, "application/json")
}

function SaveToken(token) {
    localStorage.removeItem("token")
    localStorage.setItem("token", token)
}

function RemoveToken() {
    localStorage.removeItem("token")
}

const AuthService = {
    Login, SignUp, SaveToken,
    RemoveToken, Logout, CheckUserExist
}

export default AuthService