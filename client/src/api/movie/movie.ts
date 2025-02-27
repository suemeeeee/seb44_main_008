import { instance } from '../api';

type MovieType = [
  movies: {
    movieId: number;
    title: string;
  },
];

export const getMovie = (movieName: string): Promise<MovieType> => {
  return instance.get(`/movies?q=${movieName}`).then(res => res.data.data);
};
