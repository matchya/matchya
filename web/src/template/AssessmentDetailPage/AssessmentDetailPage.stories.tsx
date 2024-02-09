import { Meta, StoryObj } from '@storybook/react';

import { QuestionsListTemplate } from '..';
import { LayoutDecorator } from '../../../.storybook/decorators';

import Component from './AssessmentDetailPage';

import { mockedAssessments } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Page',
  component: Component,
  decorators: [LayoutDecorator],
};

export default meta;

type Story = StoryObj<typeof Component>;

export const AssessmentDetailPage: Story = {
  render: () => (
    <Component
      assessment={mockedAssessments[0]}
      isLoading={false}
      questionsListFragment={
        <QuestionsListTemplate
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
              subtopic: 'docker',
              isOriginal: true,
              createdAt: '',
            },
            {
              id: '23c2e832-09c6-49a0-aec4-70bfc6a31f0b',
              context:
                'Explain the concept of Hexagonal Architecture in software design. What are the key benefits of using Hexagonal Architecture?',
              topic: 'Hexagonal Architecture',
              description:
                'Explain the concept of Hexagonal Architecture in software design. What are the key benefits of using Hexagonal Architecture?',
              difficulty: 'easy',
              subtopic: 'docker',
              isOriginal: true,
              createdAt: '',
            },
          ]}
        />
      }
    />
  ),
};
