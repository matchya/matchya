--liquibase formatted sql

--changeset author:1
CREATE TABLE IF NOT EXISTS company (
	id varchar(255) NOT NULL PRIMARY KEY,
	name varchar(255) NOT NULL,
	email varchar(255) NOT NULL UNIQUE,
	github_access_token bytea,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP
);
--rollback DROP TABLE IF EXISTS company;


--changeset author:2
CREATE TABLE IF NOT EXISTS company_repository (
	company_id varchar(255),
	repository_name varchar(255),
	primary key (company_id, repository_name),
	foreign key (company_id) references company(id)
);
--rollback DROP TABLE IF EXISTS company_repository;


--changeset author:3
CREATE TABLE IF NOT EXISTS candidate (
	id varchar(255) not null primary key,
	email varchar(255) unique,
	first_name varchar(255),
	last_name varchar(255),
	github_username varchar(255),
	created_at timestamp default current_timestamp
);
--rollback DROP TABLE IF EXISTS candidate;


--changeset author:4
CREATE TABLE IF NOT EXISTS assessment (
	id varchar(255) PRIMARY KEY,
	company_id varchar(255),
	name varchar(30),
	position_type varchar(30),
	position_level varchar(30),
	created_at timestamp default CURRENT_TIMESTAMP,
	updated_at timestamp default CURRENT_TIMESTAMP,
	foreign key (company_id) references company(id)
);
--rollback DROP TABLE IF EXISTS assessment;


--changeset author:5
CREATE TABLE IF NOT EXISTS assessment_candidate (
	assessment_id varchar(255),
	candidate_id varchar(255),
	primary key (assessment_id, candidate_id),
	foreign key (assessment_id) references assessment(id),
	foreign key (candidate_id) references candidate(id)
);
--rollback DROP TABLE IF EXISTS company_candidate;


--changeset author:6
CREATE TABLE IF NOT EXISTS question (
	id varchar(255) not null PRIMARY KEY,
	text varchar(1023),
	difficulty varchar(30),
	topic varchar(30),
	created_at timestamp default CURRENT_TIMESTAMP
);
--rollback DROP TABLE IF EXISTS question;


--changeset author:7
CREATE TABLE IF NOT EXISTS assessment_question (
	assessment_id varchar(255),
	question_id varchar(255),
	primary key (assessment_id, question_id),
	foreign key (assessment_id) references assessment(id),
	foreign key (question_id) references question(id)
);
--rollback DROP TABLE IF EXISTS assessment_question;


--changeset author:8
CREATE TABLE IF NOT EXISTS metric (
	id varchar(255) not null primary key,
	question_id varchar(255),
	name varchar(255),
	scoring varchar(1023),
	weight float,
	foreign key (question_id) references question(id)
);
--rollback DROP TABLE IF EXISTS metric;


--changeset author:9
CREATE TABLE IF NOT EXISTS interview (
	id varchar(255) not null primary key,
	candidate_id varchar(255),
	assessment_id varchar(255),
	total_score float,
	summary varchar(1023),
	video_url varchar(1023),
	status varchar(30) default 'PENDING',
	created_at timestamp default CURRENT_TIMESTAMP,
	foreign key (candidate_id) references candidate(id),
	foreign key (assessment_id) references assessment(id)
);
--rollback DROP TABLE IF EXISTS candidate_result;


--changeset author:10
CREATE TABLE IF NOT EXISTS answer (
	id varchar(255) not null primary key,
	interview_id varchar(255),
	question_id varchar(255),
	audio_url varchar(1023),
	score float,
	feedback varchar(1023),
	created_at timestamp default CURRENT_TIMESTAMP,
	foreign key (interview_id) references interview(id),
	foreign key (question_id) references question(id)
);
--rollback DROP TABLE IF EXISTS answer;


--changeset author:11
ALTER TABLE assessment_candidate ADD COLUMN IF NOT EXISTS created_at timestamp default CURRENT_TIMESTAMP;
--rollback ALTER TABLE assessment_candidate DROP COLUMN IF EXISTS created_at;
