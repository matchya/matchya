--liquibase formatted sql

--changeset author:1
CREATE TABLE IF NOT EXISTS company (
    id varchar(255) NOT NULL PRIMARY KEY,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL UNIQUE,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);
--rollback DROP TABLE IF EXISTS company CASCADE;

--changeset author:2
CREATE TABLE IF NOT EXISTS company_repository (
    company_id varchar(255),
    repository_name varchar(255),
    primary key (company_id, repository_name),
    foreign key (company_id) references company(id)
);
--rollback DROP TABLE IF EXISTS company_repository CASCADE;

--changeset author:3
CREATE TABLE IF NOT EXISTS candidate (
    id varchar(255) not null primary key,
    email varchar(255) unique,
    name varchar(255),
    github_username varchar(255),
    created_at timestamp default current_timestamp
);
--rollback DROP TABLE IF EXISTS candidate CASCADE;

--changeset author:4
CREATE TABLE IF NOT EXISTS assessment (
    id varchar(255) PRIMARY KEY,
    company_id varchar(255),
    name varchar(255),
    position_type varchar(30),
    position_level varchar(30),
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    deleted_at timestamp default null,
    foreign key (company_id) references company(id)
);
--rollback DROP TABLE IF EXISTS assessment CASCADE;

--changeset author:5
CREATE TABLE IF NOT EXISTS assessment_candidate (
    assessment_id varchar(255),
    candidate_id varchar(255),
    created_at timestamp default CURRENT_TIMESTAMP,
    primary key (assessment_id, candidate_id),
    foreign key (assessment_id) references assessment(id),
    foreign key (candidate_id) references candidate(id)
);
--rollback DROP TABLE IF EXISTS assessment_candidate CASCADE;

--changeset author:6
CREATE TABLE IF NOT EXISTS quiz (
    id varchar(255) not null PRIMARY KEY,
    context varchar(1023),
    subtopic varchar(255),
    description varchar(1023),
    is_original boolean default true,
    difficulty varchar(30),
    topic varchar(255),
    created_at timestamp default CURRENT_TIMESTAMP
);
--rollback DROP TABLE IF EXISTS quiz CASCADE;

--changeset author:7
CREATE TABLE IF NOT EXISTS assessment_quiz (
    assessment_id varchar(255),
    quiz_id varchar(255),
    primary key (assessment_id, quiz_id),
    foreign key (assessment_id) references assessment(id),
    foreign key (quiz_id) references quiz(id)
);
--rollback DROP TABLE IF EXISTS assessment_quiz CASCADE;

--changeset author:8
CREATE TABLE IF NOT EXISTS metric (
    id varchar(255) not null primary key,
    quiz_id varchar(255),
    name varchar(255),
    scoring varchar(1023),
    weight float,
    foreign key (quiz_id) references quiz(id)
);
--rollback DROP TABLE IF EXISTS metric CASCADE;

--changeset author:9
CREATE TABLE IF NOT EXISTS interview (
    id varchar(255) not null primary key,
    candidate_id varchar(255),
    assessment_id varchar(255),
    total_score float,
    summary varchar(1023),
    status varchar(30) default 'PENDING',
    created_at timestamp default CURRENT_TIMESTAMP,
    foreign key (candidate_id) references candidate(id),
    foreign key (assessment_id) references assessment(id)
);
--rollback DROP TABLE IF EXISTS interview CASCADE;

--changeset author:10
CREATE TABLE IF NOT EXISTS answer (
    id varchar(255) not null primary key,
    interview_id varchar(255),
    quiz_id varchar(255),
    video_url varchar(1023),
    score float,
    feedback varchar(1023),
    created_at timestamp default CURRENT_TIMESTAMP,
    foreign key (interview_id) references interview(id),
    foreign key (quiz_id) references quiz(id)
);
--rollback DROP TABLE IF EXISTS answer CASCADE;

--changeset author:11
CREATE TABLE IF NOT EXISTS question (
    id varchar(255) not null PRIMARY KEY,
    quiz_id varchar(255),
    text varchar(1023),
    question_number int,
    criteria text,
    foreign key (quiz_id) references quiz(id)
);
--rollback DROP TABLE IF EXISTS question;

--changeset author:12
ALTER TABLE quiz
ADD COLUMN additional_criteria text,
ADD COLUMN max_score float;
--rollback ALTER TABLE quiz DROP COLUMN additional_criteria, DROP COLUMN max_score;
