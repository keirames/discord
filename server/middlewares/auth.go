package middlewares

import (
	"context"
	"fmt"
	"net/http"
	"squirrel/db/entities"
	"squirrel/repository"
	"squirrel/service"
)

type authResponseWriter struct {
	http.ResponseWriter
	http.Hijacker
	tokenToResolver string
	tokenFromCookie string
}

type ContextKey string

const TokenContextKey = "token"
const AuthContextKey = "auth-claims"
const UserContextKey = "auth-user"
const CookieName = "auth-cookie"

// Respect the Hijack
// func (arw *authResponseWriter) Hijack() (net.Conn, *bufio.ReadWriter, error) {
// 	h, ok := arw.(http.Hijacker)
// 	if !ok {
// 		return nil, nil, errors.New("hijack not supported")
// 	}
// 	return h.Hijack()
// }

func (arw *authResponseWriter) Write(b []byte) (int, error) {

	if arw.tokenFromCookie != arw.tokenToResolver {
		http.SetCookie(arw, &http.Cookie{
			Name:     CookieName,
			Value:    arw.tokenToResolver,
			HttpOnly: true,
			Path:     "/",
		})
	}

	return arw.ResponseWriter.Write(b)
}

func SetCookie(ctx context.Context, value string) {
	tokenPointer := ctx.Value(ContextKey(TokenContextKey)).(*string)
	*tokenPointer = value
}

func GetClaims(ctx context.Context) *service.JwtCustomClaim {
	raw, _ := ctx.Value(ContextKey(AuthContextKey)).(*service.JwtCustomClaim)
	return raw
}

func GetUser(ctx context.Context) *entities.User {
	raw, _ := ctx.Value(ContextKey(UserContextKey)).(*entities.User)
	return raw
}

func AuthMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Keep hijacker to use websocket
			h, ok := w.(http.Hijacker)
			if !ok {
				// TODO: cannot process if not support
				fmt.Println("Not support Hijacker")
			}

			isMobile := IsFromMobile(r.Context())
			if isMobile {
				next.ServeHTTP(w, r)
				return
			}

			arw := authResponseWriter{w, h, "", ""}

			c, err := r.Cookie(CookieName)

			if c != nil {
				arw.tokenFromCookie = c.Value
				arw.tokenToResolver = c.Value
			}

			// We pass the pointer of token into ctx inside resolver
			// in order to set it inside resolver - after token generated
			ctx := context.WithValue(r.Context(), ContextKey(TokenContextKey), &arw.tokenToResolver)
			// Allow unauthenticated user in
			if c == nil || err != nil {
				r = r.WithContext(ctx)

				next.ServeHTTP(&arw, r)
				return
			}

			// Validate token
			validate, err := service.ValidateJwt(context.Background(), c.Value)
			if err != nil || !validate.Valid {
				ctx = context.WithValue(ctx, ContextKey(AuthContextKey), nil)
				r = r.WithContext(ctx)
				next.ServeHTTP(&arw, r)

				return
			}

			customClaims, ok := validate.Claims.(*service.JwtCustomClaim)
			if !ok {
				ctx = context.WithValue(ctx, ContextKey(AuthContextKey), nil)
				r = r.WithContext(ctx)
				next.ServeHTTP(&arw, r)

				return
			}

			// Get user detail
			user, err := repository.UserRepo.FindByID(customClaims.UserID)
			if err != nil {
				ctx = context.WithValue(ctx, ContextKey(AuthContextKey), nil)
				r = r.WithContext(ctx)
				next.ServeHTTP(&arw, r)

				return
			}

			ctx = context.WithValue(ctx, ContextKey(AuthContextKey), customClaims)
			ctx = context.WithValue(ctx, ContextKey(UserContextKey), user)
			r = r.WithContext(ctx)

			next.ServeHTTP(&arw, r)
		})
	}
}
