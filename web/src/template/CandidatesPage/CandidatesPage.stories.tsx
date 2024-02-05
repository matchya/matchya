import { Meta, StoryObj } from '@storybook/react';

import { LayoutDecorator } from '../../../.storybook/decorators';

import Component from './CandidatesPage';

import { mockedCandidates } from '@/data/mock';

const meta: Meta<typeof Component> = {
  title: 'Page',
  component: Component,
  decorators: [LayoutDecorator],
};

export default meta;

type Story = StoryObj<typeof Component>;

export const CandidatesPage: Story = {
  render: () => <Component candidates={mockedCandidates} isLoading={false} />,
};
