import type { Meta, StoryObj } from '@storybook/react'

import { Box } from './index'

const args: React.ComponentProps<typeof Box> = {
  children: 'Content inside the Box',
}

const meta: Meta<typeof Box> = {
  title: 'UIKit/Box',
  component: Box,
  tags: ['autodocs'],
  args,
}

export default meta
type Story = StoryObj<typeof Box>

export const Primary: Story = {
  args: {},
}
