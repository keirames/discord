package middlewares

import (
	"context"
	"discord/repository"
	"discord/service"
	"net/http"
	"strings"
)

func failToRecognizeBearer(
	ctx context.Context,
	w http.ResponseWriter,
	r *http.Request,
	next http.Handler,
) {
	ctx = context.WithValue(ctx, ContextKey(authContextKey), nil)
	r = r.WithContext(ctx)
	next.ServeHTTP(w, r)
}

func AuthHeaderMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			isMobile := IsFromMobile(r.Context())

			if !isMobile {
				next.ServeHTTP(w, r)
				return
			}

			reqToken := r.Header.Get("Authorization")
			splitToken := strings.Split(reqToken, "Bearer")

			// Allow unauthenticated user in
			if len(splitToken) != 2 {
				next.ServeHTTP(w, r)
				return
			}

			if len(splitToken) == 2 {
				ctx := r.Context()

				reqToken = strings.TrimSpace(splitToken[1])

				validate, err := service.ValidateJwt(context.Background(), reqToken)
				if err != nil || !validate.Valid {
					failToRecognizeBearer(ctx, w, r, next)
					return
				}

				customClaims, ok := validate.Claims.(*service.JwtCustomClaim)
				if !ok {
					failToRecognizeBearer(ctx, w, r, next)
					return
				}

				// Get user detail
				user, err := repository.UserRepo.FindByID(customClaims.UserID)
				if err != nil {
					failToRecognizeBearer(ctx, w, r, next)
					return
				}

				ctx = context.WithValue(ctx, ContextKey(authContextKey), customClaims)
				ctx = context.WithValue(ctx, ContextKey(userContextKey), user)
				r = r.WithContext(ctx)

				next.ServeHTTP(w, r)
				return
			}
		})
	}
}
