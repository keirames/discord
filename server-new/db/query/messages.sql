-- name: GetMessageById :one
select * from messages m where m.id = 1;

-- name: ListMessages :many
SELECT * FROM messages
INNER JOIN users u on u.id = messages.user_id
WHERE room_id = 1
ORDER BY messages.id;