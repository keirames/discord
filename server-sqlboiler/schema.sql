drop table if exists messages;
drop table if exists users;
drop table if exists rooms;
drop table if exists room_members;

create table users (
	id serial not null primary key,
	name varchar not null
);

create table rooms (
	id serial not null primary key,
	title varchar not null
);

create table messages (
	id serial not null primary key,
	text text not null,
	user_id int,
	room_id int,
	
	foreign key(user_id) references users(id),
	foreign key(room_id) references rooms(id)
);

create table room_members (
	user_id int references users,
	room_id int references rooms,
	
	primary key(user_id, room_id)
);