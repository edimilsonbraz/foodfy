const express = require('express')
const routes = express.Router()


const SessionController = require('../app/controllers/SessionController')
const { isLoggedRedirectToUsers } = require('../app/middlewares/session')
const SessionValidator = require('../app/validators/session')


// //  login / logout
routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)

routes.post('/logout', SessionController.logout)

// reset password / forgot
routes.get('/forgot-password', SessionController.forgotPasswordToForm)
routes.post('/forgot-password', SessionValidator.forgotPassword, SessionController.forgotPassword)

routes.get('/reset-password', SessionController.resetPasswordToForm)
routes.post('/reset-password', SessionValidator.resetPassword, SessionController.resetPassword)


module.exports = routes
