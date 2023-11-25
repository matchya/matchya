--liquibase formatted sql

--changeset author:1
CREATE TABLE IF NOT EXISTS company (
	id varchar(255) NOT NULL PRIMARY KEY,
	name varchar(255) NOT NULL,
	email varchar(255) NOT NULL unique,
	github_username varchar(255),
	password bytea,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP
);
--rollback DROP TABLE IF EXISTS company;

--changeset author:2
CREATE TABLE IF NOT EXISTS position (
	id varchar(255) not null primary key,
	company_id varchar(255),
	name varchar(255),
	created_at timestamp default current_timestamp,
	foreign key (company_id) references company(id)
);
--rollback DROP TABLE IF EXISTS position;

--changeset author:3
CREATE TABLE IF NOT EXISTS Candidate (
	id varchar(255) not null primary key,
	first_name varchar(255),
	last_name varchar(255),
	github_username varchar(255),
	email varchar(255) unique,
	created_at timestamp default current_timestamp
);
--rollback DROP TABLE IF EXISTS Candidate;

--changeset author:4
create table CandidateResult (
	id varchar(255) not null primary key,
	position_id varchar(255),
	candidate_id varchar(255),
	total_score int,
	summary varchar(255),
	created_at timestamp default CURRENT_TIMESTAMP,
	foreign key (position_id) references Position(id),
	foreign key (candidate_id) references Candidate(id)
);
--rollback DROP TABLE IF EXISTS CandidateResult;

--changeset author:5
create table AssessmentCriteria (
	id varchar(255) not null primary key,
	candidate_result_id varchar(255),
	criterion_id varchar(255),
	score int,
	reason varchar(255),
	foreign key (candidate_result_id) references CandidateResult(id),
);
--rollback DROP TABLE IF EXISTS AssessmentCriteria;