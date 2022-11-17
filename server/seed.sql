insert into users(id, name)
  VALUES ('14cb7695-0a3c-4ab4-9bb5-63bbb2f3495d', 'Garry'),
  ('8e8c6c7c-1180-4539-b7b4-f97d88f98552', 'Jake'),
  ('6d06ab45-28cc-4d60-9d48-cec566342b2c', 'Robert'),
  ('855fd687-9001-4512-b317-f2a71fa57cf5', 'William'),
  ('6fef0974-1302-41dd-ace5-f3a9de90fd78', 'Michael'),
  ('ec64f3ba-8ab7-4076-b602-fcc7523ac7f6', 'Charles');

insert into rooms(id, title)
values ('d537e86a-1c43-4b7e-8bfc-89295c6226d5', 'A'),
('a9561ffe-53f8-45cd-bc9a-dd7b01223a87', 'B'),
('040f28aa-a9f6-475b-9e05-5b7de9600ce4', 'C'),
('dec456c9-49bb-44fc-88ea-98610b50e33c', 'D'),
('293b701e-df09-4aef-a39e-9d31b541fbe9', 'E'),
('c139cfa5-8f8a-477e-ab47-3338a7f458e2', 'F'),
('b49e7ea6-d1d5-48ac-911d-8bd62af145bd', 'G');

insert into room_members(user_id, room_id)
VALUES ('14cb7695-0a3c-4ab4-9bb5-63bbb2f3495d', 'd537e86a-1c43-4b7e-8bfc-89295c6226d5'),
('8e8c6c7c-1180-4539-b7b4-f97d88f98552', 'd537e86a-1c43-4b7e-8bfc-89295c6226d5'),
('6d06ab45-28cc-4d60-9d48-cec566342b2c', 'd537e86a-1c43-4b7e-8bfc-89295c6226d5'),
('855fd687-9001-4512-b317-f2a71fa57cf5', 'd537e86a-1c43-4b7e-8bfc-89295c6226d5'),
('14cb7695-0a3c-4ab4-9bb5-63bbb2f3495d', 'a9561ffe-53f8-45cd-bc9a-dd7b01223a87'),
('8e8c6c7c-1180-4539-b7b4-f97d88f98552', 'a9561ffe-53f8-45cd-bc9a-dd7b01223a87'),
('14cb7695-0a3c-4ab4-9bb5-63bbb2f3495d', '040f28aa-a9f6-475b-9e05-5b7de9600ce4'),
('8e8c6c7c-1180-4539-b7b4-f97d88f98552', '040f28aa-a9f6-475b-9e05-5b7de9600ce4'),
('14cb7695-0a3c-4ab4-9bb5-63bbb2f3495d', 'dec456c9-49bb-44fc-88ea-98610b50e33c'),
('8e8c6c7c-1180-4539-b7b4-f97d88f98552', 'dec456c9-49bb-44fc-88ea-98610b50e33c'),
('14cb7695-0a3c-4ab4-9bb5-63bbb2f3495d', '293b701e-df09-4aef-a39e-9d31b541fbe9'),
('8e8c6c7c-1180-4539-b7b4-f97d88f98552', '293b701e-df09-4aef-a39e-9d31b541fbe9'),
('14cb7695-0a3c-4ab4-9bb5-63bbb2f3495d', 'c139cfa5-8f8a-477e-ab47-3338a7f458e2'),
('8e8c6c7c-1180-4539-b7b4-f97d88f98552', 'c139cfa5-8f8a-477e-ab47-3338a7f458e2'),
('14cb7695-0a3c-4ab4-9bb5-63bbb2f3495d', 'b49e7ea6-d1d5-48ac-911d-8bd62af145bd'),
('8e8c6c7c-1180-4539-b7b4-f97d88f98552', 'b49e7ea6-d1d5-48ac-911d-8bd62af145bd');

insert into messages(id, text, room_id, user_id)
values ('6cf889c0-760c-4603-b391-93f1c387d9c8', 'Hi everyone', 'd537e86a-1c43-4b7e-8bfc-89295c6226d5', '14cb7695-0a3c-4ab4-9bb5-63bbb2f3495d'),
('3a7ddd15-12af-4a04-b70f-d076e908517a', 'i am new here', 'd537e86a-1c43-4b7e-8bfc-89295c6226d5', '14cb7695-0a3c-4ab4-9bb5-63bbb2f3495d'),
('330e0324-a00e-4f11-b51f-b35db66b2c4d', 'nice to meet you', 'd537e86a-1c43-4b7e-8bfc-89295c6226d5', '14cb7695-0a3c-4ab4-9bb5-63bbb2f3495d'),
('92ea6ccb-8f83-4483-98de-4f915adf62c1', 'nice to meet you too', 'd537e86a-1c43-4b7e-8bfc-89295c6226d5', '8e8c6c7c-1180-4539-b7b4-f97d88f98552'),
('a314f28f-364c-4894-922b-3b3cdb1c0dd7', 'yes', 'd537e86a-1c43-4b7e-8bfc-89295c6226d5', '6d06ab45-28cc-4d60-9d48-cec566342b2c');