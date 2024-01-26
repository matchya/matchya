import { Meta, StoryObj } from '@storybook/react';

import Component from './CreateAssessmentPage';

const meta: Meta<typeof Component> = {
  title: 'Template',
  component: Component,
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
      isLoading={false}
      onTestNameChange={() => {}}
      onPositionChange={() => {}}
      onLevelChange={() => {}}
      setAdvanceSettingOpen={() => {}}
      handleSubmit={() => {}}
    />
  ),
};
