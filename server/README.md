Migration command:

- migrate -path db/migrations -database "postgresql://postgres:password@localhost:5433/chat-app?sslmode=disable" -verbose up

GraphQL gen command:
- go run github.com/99designs/gqlgen generate