create table seen_members (
	user_id uuid not null,
	room_id uuid not null,
	message_id uuid not null,

	foreign key (user_id) references users (id),
	foreign key (room_id) references rooms (id),
  foreign key (message_id) references messages (id),

	primary key (user_id, room_id, message_id)
);