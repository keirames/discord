create table users (
	id uuid primary key default uuid_generate_v4(),
	name varchar(50) not null,
	created_at timestamp with time zone default now(),
);

create table servers (
	id uuid primary key default uuid_generate_v4(),
	title varchar(255) not null,
	created_at timestamp with time zone default now(),
);

create table voice_channels (
	id uuid primary key default uuid_generate_v4(),
	title varchar(255) not null,
	created_at timestamp with time zone default now(),
);

create table voice_channels_users(
	user_id uuid not null,
	voice_room_id uuid not null,
	created_at timestamp with time zone default now(),
	
	foreign key(user_id) references users(id),
	foreign key(voice_room_id) references voice_rooms(id),
	
	primary key(user_id, voice_room_id)
);