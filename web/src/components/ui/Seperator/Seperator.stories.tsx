import { Meta, StoryObj } from '@storybook/react';

import { Separator as Component } from './Seperator';

const meta: Meta<typeof Component> = {
  title: 'Component',
  component: Component,
};

export default meta;

type Story = StoryObj<typeof Component>;

export const Seperator: Story = {
  render: () => (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
        <p className="text-sm text-muted-foreground">
          An open-source UI component library.
        </p>
      </div>
      <Component className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Component orientation="vertical" />
        <div>Docs</div>
        <Component orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  ),
};
