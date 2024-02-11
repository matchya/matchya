import { Meta, StoryObj } from '@storybook/react';

import Component from './QuestionsList';

const meta: Meta<typeof Component> = {
  title: 'Fragments/QuestionsList',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const WithQuestions: Story = {
  render: () => (
    <>
      <Component
        isLoading={false}
        quizzes={[
          {
            id: '5e88efd5-760b-4adb-9d42-bbaba76cac75',
            context: 'Context here',
            subtopic: 'Context here',
            isOriginal: false,
            createdAt: 'Context here',
            topic: 'Continuous Delivery',
            description:
              'Explain the concept of Continuous Delivery and its benefits in software development. How does it differ from Continuous Deployment?',
            difficulty: 'easy',
            questions: [
              {
                id: '5e88efd5-760b-4adb-9d42-bbaba76cac75',
                text:
                  'Explain the concept of Continuous Delivery and its benefits in software development. How does it differ from Continuous Deployment?',
                questionNumber: 1,
              },
              {
                id: '5e88efd5-760b-4adb-9d42-bbaba76cac75',
                text:
                  'How does Continuous Delivery differ from Continuous Deployment?',
                questionNumber: 2,
              },
              {
                id: '5e88efd5-760b-4adb-9d42-bbaba76cac75',
                text:
                  'What are the benefits of Continuous Delivery in software development?',
                questionNumber: 3,
              },
            ],
          },
          {
            id: '23c2e832-09c6-49a0-aec4-70bfc6a31f0b',
            context: 'Context here',
            subtopic: 'Context here',
            isOriginal: false,
            createdAt: 'Context here',
            topic: 'Hexagonal Architecture',
            description:
              'Explain the concept of Hexagonal Architecture in software design. What are the key benefits of using Hexagonal Architecture?',
            difficulty: 'easy',
            questions: [
              {
                id: '23c2e832-09c6-49a0-aec4-70bfc6a31f0b',
                text:
                  'Explain the concept of Hexagonal Architecture in software design. What are the key benefits of using Hexagonal Architecture?',
                questionNumber: 1,
              },
              {
                id: '23c2e832-09c6-49a0-aec4-70bfc6a31f0b',
                text:
                  'What are the key benefits of using Hexagonal Architecture?',
                questionNumber: 2,
              },
              {
                id: '23c2e832-09c6-49a0-aec4-70bfc6a31f0b',
                text:
                  'How does Hexagonal Architecture differ from traditional software design?',
                questionNumber: 3,
              },
            ],
          },
        ]}
      />
    </>
  ),
};

export const IsLoading: Story = {
  render: () => (
    <>
      <Component isLoading={true} quizzes={[]} />
    </>
  ),
};
