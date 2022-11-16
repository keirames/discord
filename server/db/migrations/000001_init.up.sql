create table users (
	id uuid primary key default uuid_generate_v4(),
	name varchar(50) not null
);

create table rooms (
	id uuid primary key default uuid_generate_v4(),
	title varchar(255) not null
);

create table messages (
	id uuid primary key default uuid_generate_v4(),
	text text not null,

	room_id uuid not null,
	user_id uuid not null,
	
	foreign key (room_id) references rooms (id),
	foreign key (user_id) references users (id)
);

create table room_members (
	user_id uuid not null,
	room_id uuid not null,
	
	foreign key (user_id) references users (id),
	foreign key (room_id) references rooms (id),

	primary key(user_id, room_id)
);