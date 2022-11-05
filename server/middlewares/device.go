package middlewares

import (
	"context"
	"net/http"
	"strconv"
)

const isMobileContextKey = "is-mobile"

func IsFromMobile(ctx context.Context) bool {
	isMobile, ok := ctx.Value(ContextKey(isMobileContextKey)).(bool)
	if !ok {
		return false
	}

	return isMobile
}

func DeviceMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			isMobile, err := strconv.ParseBool(r.Header.Get("x-mobile"))
			if err != nil {
				ctx := context.WithValue(r.Context(), ContextKey(isMobileContextKey), false)
				req := r.WithContext(ctx)
				next.ServeHTTP(w, req)

				return
			}

			ctx := context.WithValue(r.Context(), ContextKey(isMobileContextKey), isMobile)
			req := r.WithContext(ctx)
			next.ServeHTTP(w, req)
		})
	}
}
