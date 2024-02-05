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
          questions={[
            {
              id: '5e88efd5-760b-4adb-9d42-bbaba76cac75',
              text: 'Explain the concept of Continuous Delivery and its benefits in software development. How does it differ from Continuous Deployment?',
              topic: 'Continuous Delivery',
              difficulty: 'easy',
            },
            {
              id: '23c2e832-09c6-49a0-aec4-70bfc6a31f0b',
              text: 'Explain the concept of Hexagonal Architecture in software design. What are the key benefits of using Hexagonal Architecture?',
              topic: 'Hexagonal Architecture',
              difficulty: 'easy',
            },
          ]}
        />
      }
    />
  ),
};
