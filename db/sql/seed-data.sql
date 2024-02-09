--liquibase formatted sql

--changeset author:1
INSERT INTO quiz (id, context, subtopic, description, is_original, difficulty, topic, created_at)
VALUES
('1', 'Context 1', 'Subtopic 1', 'Description 1', true, 'Easy', 'Topic 1', CURRENT_TIMESTAMP),
('2', 'Context 2', 'Subtopic 2', 'Description 2', false, 'Medium', 'Topic 2', CURRENT_TIMESTAMP),
('3', 'Context 3', 'Subtopic 3', 'Description 3', true, 'Hard', 'Topic 3', CURRENT_TIMESTAMP);
--rollback DELETE FROM quiz WHERE id IN ('1', '2', '3');
