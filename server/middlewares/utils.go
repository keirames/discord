package middlewares

type ContextKey string

const tokenContextKey = "token"
const authContextKey = "auth-claims"
const userContextKey = "auth-user"
const cookieName = "auth-cookie"
