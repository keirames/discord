Migration command:

- migrate -path db/migrations -database "postgresql://postgres:password@localhost:5433/discord?sslmode=disable" -verbose up
- migrate create -ext sql -dir db/migrations -seq create_users_table

GraphQL gen command:

- go run github.com/99designs/gqlgen generate

REFACTOR CRITERIA:

- change repository name ex: voice-room-repository.go -> voice-room.repository.go
- split schema.resolvers.go into multiple files
- change repository var name ex: RoomRepo -> Room cause you can call repository.Room.findX
- find a way to use Placeholder squirrel in every query
