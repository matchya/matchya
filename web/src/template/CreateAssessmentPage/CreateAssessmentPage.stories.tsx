import { Meta, StoryObj } from '@storybook/react';

import { LayoutDecorator } from '../../../.storybook/decorators';

import Component from './CreateAssessmentPage';

const meta: Meta<typeof Component> = {
  title: 'Page',
  component: Component,
  decorators: [LayoutDecorator],
};

export default meta;

type Story = StoryObj<typeof Component>;

export const CreateAssessmentPage: Story = {
  render: () => (
    <Component
      testName={'test'}
      selectedPosition={'Software Engineer'}
      selectedLevel={'Senior'}
      advanceSettingOpen={false}
      topicInputValue=""
      specifiedTopics={['topic1', 'topic2']}
      isLoading={false}
      onTestNameChange={() => {}}
      onPositionChange={() => {}}
      onLevelChange={() => {}}
      setAdvanceSettingOpen={() => {}}
      setTopicInputValue={() => {}}
      handleAddTopics={() => {}}
      handleRemoveTopic={() => {}}
      handleSubmit={() => {}}
    />
  ),
};
