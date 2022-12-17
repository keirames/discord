create table users(
	id uuid primary key default uuid_generate_v4(),
	name varchar(50) not null,
	created_at timestamp with time zone default now()
);

create table guilds(
	id uuid primary key default uuid_generate_v4(),
	name varchar(255) not null,
	created_at timestamp with time zone default now()
);

create table voice_channels(
	id uuid primary key default uuid_generate_v4(),
	name varchar(255) not null,
	created_at timestamp with time zone default now(),
	guild_id uuid not null,

	foreign key(guild_id) references guilds(id)
);

create table voice_channels_users(
	user_id uuid not null,
	voice_channel_id uuid not null,
	created_at timestamp with time zone default now(),
	
	foreign key(user_id) references users(id),
	foreign key(voice_channel_id) references voice_channels(id),
	
	primary key(user_id, voice_channel_id)
);

create table guilds_users(
	user_id uuid not null,
	guild_id uuid not null,
	created_at timestamp with time zone default now(),

	foreign key(user_id) references users(id),
	foreign key(guild_id) references guilds(id),

	primary key(user_id, guild_id)
);