package service

import (
	"context"
	"discord/config"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

type JwtCustomClaim struct {
	UserID string `json:"userId"`
	jwt.RegisteredClaims
}

func GenerateJwt(ctx context.Context, userID string) (string, error) {
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, &JwtCustomClaim{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 3)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	})

	fmt.Println([]byte(config.JWT_SECRET))
	token, err := t.SignedString([]byte(config.JWT_SECRET))
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

		return []byte(config.JWT_SECRET), nil
	})
}
