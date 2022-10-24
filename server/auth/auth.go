package auth

import (
	"context"
	"net/http"
)

type authResponseWriter struct {
	http.ResponseWriter
	tokenToResolver string
	tokenFromCookie string
}

type ContextKey string

const contextKey = "token"
const cookieName = "auth-cookie"

func (arw *authResponseWriter) Write(b []byte) (int, error) {

	if arw.tokenFromCookie != arw.tokenToResolver {
		http.SetCookie(arw, &http.Cookie{
			Name:     cookieName,
			Value:    arw.tokenToResolver,
			HttpOnly: true,
			Path:     "/",
		})
	}

	return arw.ResponseWriter.Write(b)
}

func SetCookie(ctx context.Context, value string) {
	authPointer := ctx.Value(ContextKey(contextKey)).(*string)
	*authPointer = value
}

func Middleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			arw := authResponseWriter{w, "", ""}

			c, _ := r.Cookie(cookieName)

			if c != nil {
				arw.tokenFromCookie = c.Value
				arw.tokenToResolver = c.Value
			}

			// We pass the pointer of token into ctx inside resolver
			// in order to set it inside resolver - after token generated
			ctx := context.WithValue(r.Context(), ContextKey(contextKey), &arw.tokenToResolver)
			r = r.WithContext(ctx)

			next.ServeHTTP(&arw, r)
		})
	}
}
