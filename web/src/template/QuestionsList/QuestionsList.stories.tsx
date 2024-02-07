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
            context:
              'Explain the concept of Continuous Delivery and its benefits in software development. How does it differ from Continuous Deployment?',
            topic: 'Continuous Delivery',
            description:
              'Explain the concept of Continuous Delivery and its benefits in software development. How does it differ from Continuous Deployment?',
            difficulty: 'easy',
          },
          {
            id: '23c2e832-09c6-49a0-aec4-70bfc6a31f0b',
            context:
              'Explain the concept of Hexagonal Architecture in software design. What are the key benefits of using Hexagonal Architecture?',
            topic: 'Hexagonal Architecture',
            description:
              'Explain the concept of Hexagonal Architecture in software design. What are the key benefits of using Hexagonal Architecture?',
            difficulty: 'easy',
          },
        ]}
      />
    </>
  ),
};
quizzes;
export const IsLoading: Story = {
  render: () => (
    <>
      <Component isLoading={true} quizzes={[]} />
    </>
  ),
};
