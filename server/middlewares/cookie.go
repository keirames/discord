package middlewares

import (
	"context"
	"discord/db/entities"
	"discord/repository"
	"discord/service"
	"fmt"
	"net/http"
)

type authResponseWriter struct {
	http.ResponseWriter
	http.Hijacker
	tokenToResolver string
	tokenFromCookie string
}

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

func GetUser(ctx context.Context) *entities.User {
	raw, _ := ctx.Value(ContextKey(userContextKey)).(*entities.User)
	return raw
}

func failToRecognizeCookie(
	ctx context.Context,
	arw *authResponseWriter,
	r *http.Request,
	next http.Handler,
) {
	ctx = context.WithValue(ctx, ContextKey(authContextKey), nil)
	r = r.WithContext(ctx)
	next.ServeHTTP(arw, r)
}

func CookieMiddleware() func(http.Handler) http.Handler {
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

			c, err := r.Cookie(cookieName)

			if c != nil {
				arw.tokenFromCookie = c.Value
				arw.tokenToResolver = c.Value
			}

			// We pass the pointer of token into ctx inside resolver
			// in order to set it inside resolver - after token generated
			ctx := context.WithValue(r.Context(), ContextKey(tokenContextKey), &arw.tokenToResolver)
			// Allow unauthenticated user in
			if c == nil || err != nil {
				r = r.WithContext(ctx)

				next.ServeHTTP(&arw, r)
				return
			}

			// Validate token
			validate, err := service.ValidateJwt(context.Background(), c.Value)
			if err != nil || !validate.Valid {
				failToRecognizeCookie(ctx, &arw, r, next)
				return
			}

			customClaims, ok := validate.Claims.(*service.JwtCustomClaim)
			if !ok {
				failToRecognizeCookie(ctx, &arw, r, next)
				return
			}

			// Get user detail
			user, err := repository.UserRepo.FindByID(customClaims.UserID)
			if err != nil {
				failToRecognizeCookie(ctx, &arw, r, next)
				return
			}

			ctx = context.WithValue(ctx, ContextKey(authContextKey), customClaims)
			ctx = context.WithValue(ctx, ContextKey(userContextKey), user)
			r = r.WithContext(ctx)

			next.ServeHTTP(&arw, r)
		})
	}
}
