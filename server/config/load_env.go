package config

import (
	"os"

	"github.com/joho/godotenv"
)

var EnvMap = map[string]string{
	"PORT":       "PORT",
	"JWT_SECRET": "JWT_SECRET",
}

var PORT = os.Getenv("PORT")
var JWT_SECRET = os.Getenv("JWT_SECRET")

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

	for _, env := range EnvMap {
		checkExist(env)
	}
}
