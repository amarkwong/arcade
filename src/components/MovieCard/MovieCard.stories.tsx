import React from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import MovieCard, {MovieCardProps, Solver} from './MovieCard';
import { time } from 'console';

export default {
  title: 'components/MovieCard',
  component: MovieCard,
} as Meta;

const Template: Story<{ emoji: string; movie: string; riddler: string; solvedBy?: Solver[]; }> = (args) => <MovieCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  emoji: '👻🚍👨👨',
  movie: 'https://m.media-amazon.com/images/M/MV5BMTkxMjYyNzgwMl5BMl5BanBnXkFtZTgwMTE3MjYyMTE@._V1_SX300.jpg',
  riddler: 'Feifan',
};