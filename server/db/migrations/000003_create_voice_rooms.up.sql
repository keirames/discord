CREATE TABLE voice_rooms(
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	title VARCHAR(255) NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE voice_rooms_members(
	user_id uuid NOT NULL,
	voice_room_id uuid NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	
	FOREIGN KEY(user_id) REFERENCES users(id),
	FOREIGN KEY(voice_room_id) REFERENCES voice_rooms(id),
	
	PRIMARY KEY(user_id, voice_room_id)
);