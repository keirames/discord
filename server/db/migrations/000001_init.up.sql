create table users (
	id serial primary key,
	name varchar(50) not null
);

create table rooms (
	id serial primary key,
	title varchar(50) not null
);

create table messages (
	id serial primary key,
	text text not null,
	room_id int not null,
	user_id int not null,
	
	foreign key (room_id) references rooms (id),
	foreign key (user_id) references users (id)
);

create table room_members (
	user_id int not null,
	room_id int not null,
	
	foreign key (user_id) references users (id),
	foreign key (room_id) references rooms (id)
);