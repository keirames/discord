package middlewares

import (
	"context"
	"net/http"
	"squirrel/service"
)

type authResponseWriter struct {
	http.ResponseWriter
	tokenToResolver string
	tokenFromCookie string
}

type ContextKey string

const tokenContextKey = "token"
const authContextKey = "auth"
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
	tokenPointer := ctx.Value(ContextKey(tokenContextKey)).(*string)
	*tokenPointer = value
}

func GetClaims(ctx context.Context) *service.JwtCustomClaim {
	raw, _ := ctx.Value(ContextKey(authContextKey)).(*service.JwtCustomClaim)
	return raw
}

func AuthMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			arw := authResponseWriter{w, "", ""}

			c, err := r.Cookie(cookieName)

			if c != nil {
				arw.tokenFromCookie = c.Value
				arw.tokenToResolver = c.Value
			}

			// We pass the pointer of token into ctx inside resolver
			// in order to set it inside resolver - after token generated
			ctx := context.WithValue(r.Context(), ContextKey(tokenContextKey), &arw.tokenToResolver)
			// Allow unauthenticated user in
			if c == nil || err == nil {
				r = r.WithContext(ctx)

				next.ServeHTTP(&arw, r)
				return
			}

			// Validate token
			validate, err := service.ValidateJwt(context.Background(), c.Value)
			if err != nil || !validate.Valid {
				// http.Error(w, "Invalid token", http.StatusForbidden)
				ctx = context.WithValue(ctx, ContextKey(authContextKey), nil)
				r = r.WithContext(ctx)
				next.ServeHTTP(&arw, r)

				return
			}

			customClaims, ok := validate.Claims.(*service.JwtCustomClaim)
			if !ok {
				ctx = context.WithValue(ctx, ContextKey(authContextKey), nil)
				r = r.WithContext(ctx)
				next.ServeHTTP(&arw, r)

				return
			}

			ctx = context.WithValue(ctx, ContextKey(authContextKey), customClaims)
			r = r.WithContext(ctx)

			next.ServeHTTP(&arw, r)
		})
	}
}
