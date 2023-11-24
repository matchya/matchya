CREATE TABLE IF NOT EXISTS company (
	id varchar(255) NOT NULL PRIMARY KEY,
	name varchar(255) NOT NULL,
	email varchar(255) NOT NULL unique,
	github_username varchar(255),
	password bytea,
	created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS position (
	id varchar(255) not null primary key,
	company_id varchar(255),
	name varchar(255),
	created_at timestamp default current_timestamp,
	foreign key (company_id) references company(id)
);
