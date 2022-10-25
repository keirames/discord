package auth

import (
	"context"
	"fmt"
	"net/http"
	"squirrel/config"

	"github.com/99designs/gqlgen/graphql"
	"github.com/golang-jwt/jwt/v4"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

type authResponseWriter struct {
	http.ResponseWriter
	tokenToResolver string
	tokenFromCookie string
}

type ContextKey string

const tokenContextKey = "token"
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
	authPointer := ctx.Value(ContextKey(tokenContextKey)).(*string)
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
			ctx := context.WithValue(r.Context(), ContextKey(tokenContextKey), &arw.tokenToResolver)
			r = r.WithContext(ctx)

			next.ServeHTTP(&arw, r)
		})
	}
}

func ExtractTokenMiddleware2() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			c, err := r.Cookie(cookieName)

			// Not allow unauthenticated users in
			if err != nil || c == nil {
				// http.Error(w, "Invalid cookie", http.StatusForbidden)
				gqlerror.Errorf("BOOM! Headshot")
				return
			}

			tokenString := c.Value

			type MyCustomClaims struct {
				Name string `json:"name"`
				jwt.StandardClaims
			}

			token, err := jwt.ParseWithClaims(
				tokenString,
				&MyCustomClaims{},
				func(token *jwt.Token) (interface{}, error) {
					return []byte(config.JWT_SECRET), nil
				},
			)
			if err != nil {
				next.ServeHTTP(w, r)
				return
			}
			if claims, ok := token.Claims.(*MyCustomClaims); ok && token.Valid {
				fmt.Printf("%v %v", claims.Name, claims.StandardClaims.ExpiresAt)
			} else {
				fmt.Println("hehe", err)
				// http.Error(w, "Invalid token", http.StatusForbidden)
				// gqlerror.Errorf("BOOM! Headshot")
				return
			}

			if err != nil {
				fmt.Println("unauthenticated", err)
				http.Error(w, "Invalid cookie", http.StatusForbidden)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func ExtractTokenMiddleware1() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// http.Error(w, "Invalid cookie", http.StatusForbidden)
			graphql.AddError(r.Context(), gqlerror.Errorf("zzzzzt"))
			next.ServeHTTP(w, r)
		})
	}
}
