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


--changeset author:12
ALTER TABLE answer RENAME COLUMN audio_url TO video_url;
ALTER TABLE interview DROP COLUMN video_url;
--rollback ALTER TABLE answer RENAME COLUMN video_url TO audio_url;
--rollback ALTER TABLE interview ADD COLUMN IF NOT EXISTS video_url varchar(1023);


--changeset author:13
ALTER TABLE candidate ADD COLUMN IF NOT EXISTS name varchar(255);
ALTER TABLE candidate DROP COLUMN IF EXISTS first_name;
ALTER TABLE candidate DROP COLUMN IF EXISTS last_name;
--rollback ALTER TABLE candidate DROP COLUMN IF EXISTS name;
--rollback ALTER TABLE candidate ADD COLUMN IF NOT EXISTS first_name varchar(255);
--rollback ALTER TABLE candidate ADD COLUMN IF NOT EXISTS last_name varchar(255);


--changeset author:14
ALTER TABLE assessment ALTER COLUMN name TYPE varchar(255);
--rollback ALTER TABLE assessment ALTER COLUMN name TYPE varchar(30);


--changeset author:15
ALTER TABLE question ALTER COLUMN topic TYPE varchar(255);
--rollback ALTER TABLE question ALTER COLUMN topic TYPE varchar(30);


--changeset author:16
ALTER TABLE company DROP COLUMN IF EXISTS github_access_token;
--rollback ALTER TABLE company ADD COLUMN IF NOT EXISTS github_access_token bytea;


--changeset author:17
ALTER TABLE assessment ADD COLUMN IF NOT EXISTS deleted_at timestamp default null;
--rollback ALTER TABLE assessment DROP COLUMN IF EXISTS deleted_at;

--changeset author:18
ALTER TABLE question RENAME TO quiz;
ALTER TABLE quiz RENAME COLUMN text TO context;
ALTER TABLE quiz ADD COLUMN IF NOT EXISTS subtopic varchar(255);
ALTER TABLE quiz ADD COLUMN IF NOT EXISTS description varchar(1023);
ALTER TABLE quiz ADD COLUMN IF NOT EXISTS is_original boolean default true;
--rollback ALTER TABLE quiz RENAME COLUMN context TO text;
--rollback ALTER TABLE quiz DROP COLUMN IF EXISTS subtopic;
--rollback ALTER TABLE quiz DROP COLUMN IF EXISTS description;
--rollback ALTER TABLE quiz DROP COLUMN IF EXISTS is_original;
--rollback RENAME TABLE quiz TO question;

--changeset author:19
--create table called question
CREATE TABLE IF NOT EXISTS question (
	id varchar(255) not null PRIMARY KEY,
	quiz_id varchar(255),
	text varchar(1023),
	foreign key (quiz_id) references quiz(id)
);
--rollback DROP TABLE IF EXISTS question;

--changeset author:20
ALTER TABLE assessment_question RENAME TO assessment_quiz;
ALTER TABLE assessment_quiz RENAME COLUMN question_id TO quiz_id;
ALTER TABLE assessment_quiz DROP CONSTRAINT assessment_question_question_id_fkey;
ALTER TABLE assessment_quiz ADD FOREIGN KEY (quiz_id) REFERENCES quiz(id);
ALTER TABLE metric RENAME COLUMN question_id TO quiz_id;
ALTER TABLE metric DROP CONSTRAINT metric_question_id_fkey;
ALTER TABLE metric ADD FOREIGN KEY (quiz_id) REFERENCES quiz(id);
ALTER TABLE answer RENAME COLUMN question_id TO quiz_id;
ALTER TABLE answer DROP CONSTRAINT answer_question_id_fkey;
ALTER TABLE answer ADD FOREIGN KEY (quiz_id) REFERENCES quiz(id);
--rollback ALTER TABLE assessment_quiz RENAME TO assessment_question;
--rollback ALTER TABLE assessment_question RENAME COLUMN quiz_id TO question_id;
--rollback ALTER TABLE assessment_question DROP CONSTRAINT assessment_quiz_quiz_id_fkey;
--rollback ALTER TABLE assessment_question ADD FOREIGN KEY (question_id) REFERENCES question(id);
--rollback ALTER TABLE metric RENAME COLUMN quiz_id TO question_id;
--rollback ALTER TABLE metric DROP CONSTRAINT metric_quiz_id_fkey;
--rollback ALTER TABLE metric ADD FOREIGN KEY (question_id) REFERENCES question(id);
--rollback ALTER TABLE answer RENAME COLUMN quiz_id TO question_id;
--rollback ALTER TABLE answer DROP CONSTRAINT answer_quiz_id_fkey;
--rollback ALTER TABLE answer ADD FOREIGN KEY (question_id) REFERENCES question(id);

--changeset author:21
ALTER TABLE question ADD COLUMN IF NOT EXISTS question_number int;
--rollback ALTER TABLE question DROP COLUMN IF EXISTS question_number;

--changeset author:22
ALTER TABLE question ADD COLUMN IF NOT EXISTS criteria text;
--rollback ALTER TABLE question DROP COLUMN IF EXISTS criteria;
