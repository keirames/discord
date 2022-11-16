Migration command:

- migrate -path db/migrations -database "postgresql://postgres:password@localhost:5433/chat-app?sslmode=disable" -verbose up
- migrate create -ext sql -dir db/migrations -seq create_users_table

GraphQL gen command:

- go run github.com/99designs/gqlgen generate
