import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import Arcade from './Arcade';

export default {
    title: 'Components/Arcade',
    component: Arcade,
} as Meta;

const Template: Story = (args) => <Arcade {...args} />;

export const Example = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};
