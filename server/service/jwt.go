package service

import (
	"context"
	"fmt"
	"squirrel/config"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

type JwtCustomClaim struct {
	ID string `json:"id"`
	jwt.RegisteredClaims
}

var jwtSecret = []byte(config.JWT_SECRET)

func GenerateJwt(ctx context.Context, userID string) (string, error) {
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, &JwtCustomClaim{
		ID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 3)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	})

	token, err := t.SignedString(jwtSecret)
	if err != nil {
		return "", err
	}

	return token, nil
}

func ValidateJwt(ctx context.Context, token string) (*jwt.Token, error) {
	return jwt.ParseWithClaims(token, &JwtCustomClaim{}, func(t *jwt.Token) (interface{}, error) {
		_, ok := t.Method.(*jwt.SigningMethodHMAC)
		if !ok {
			return nil, fmt.Errorf("there's a problem with the signing method")
		}

		return jwtSecret, nil
	})
}
