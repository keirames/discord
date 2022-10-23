package auth

import "net/http"

type authResponseWriter struct {
	http.ResponseWriter
	userIDToResolver string
	userIDFromCookie string
}

func (arw *authResponseWriter) Write(b []byte) (int, error) {
	http.SetCookie(arw, &http.Cookie{
		Name:     "auth",
		Value:    "token",
		HttpOnly: true,
		Path:     "/",
	})
	return arw.ResponseWriter.Write(b)
}

func Middleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			next.ServeHTTP(w, r)
		})
	}
}
