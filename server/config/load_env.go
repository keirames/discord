package config

import (
	"os"

	"github.com/joho/godotenv"
)

var EnvMap = map[string]string{
	"PORT":       "PORT",
	"JWT_SECRET": "JWT_SECRET",
}

var PORT string
var JWT_SECRET string

func checkExist(key string) {
	data := os.Getenv(key)
	if data == "" {
		panic("Missing env: " + key)
	}
}

func LoadEnv() {
	__DEV__ := os.Getenv("APP_ENV") != "production"

	envFile := ".env"
	if __DEV__ {
		envFile = ".env.dev"
	}

	err := godotenv.Load(envFile)
	if err != nil {
		panic("Error loading .env file")
	}

	PORT = os.Getenv("PORT")
	JWT_SECRET = os.Getenv("JWT_SECRET")

	for _, env := range EnvMap {
		checkExist(env)
	}
}
