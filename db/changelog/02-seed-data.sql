--liquibase formatted sql

--changeset author:1
INSERT INTO company (id, name, email, github_username, password, created_at)
VALUES
('4a58e15a-2e99-46c5-92de-e02add2a4553', 'Laura Perez', 'ejohnson@hotmail.com', 'ylee', '\\xe8c0927153cd057c82a1e77e9a124545c76d3772047606a9d9fad411d49f4a2f', '2022-09-01 09:29:03'),
('613bcae5-ada0-404c-be2c-7df34f7732a2', 'John Carroll', 'myersmatthew@hotmail.com', 'daniel23', '\\x372acd0c024eb817d429939127af80ad260db8e306d48f1ea031ebf24941fd45', '2023-09-27 08:10:57');
--rollback DELETE FROM company WHERE id IN ('4a58e15a-2e99-46c5-92de-e02add2a4553', '613bcae5-ada0-404c-be2c-7df34f7732a2');

--changeset author:2
INSERT INTO company (id, name, email, github_username, password, created_at)
VALUES
('343bcae5-ada0-404c-be2c-7df34f7732a2', 'Ben Parker', 'random@hotmail.com', 'ben123', '\\x372acd0c024eb817d429939127af80ad260db8e306d48f1ea031ebf24941fd45', '2023-09-27 08:10:57');
--rollback DELETE FROM company WHERE id IN ('343bcae5-ada0-404c-be2c-7df34f7732a2');

-- changeset author:3
INSERT INTO company (id, name, email, github_username, password, created_at)
VALUES
('21bcae5-ada0-404c-be2c-7df34f7732a2', 'Alice Johnson', 'alicej@example.com', 'alicej', '\\x1a2b3c4d5e6f7181920a1b2c3d4e5f6g7h8i9j0k', '2023-10-05 14:20:00'),
('32bcae5-ada0-404c-be2c-7df34f7732a2', 'Robert Smith', 'roberts@example.com', 'rob_smith', '\\x0f1e2d3c4b5a6987h6g5f4e3d2c1b0a', '2023-10-06 09:15:30');
--rollback DELETE FROM company WHERE id IN ('21bcae5-ada0-404c-be2c-7df34f7732a2', '32bcae5-ada0-404c-be2c-7df34f7732a2');
