
export type Movie = {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
};

export type MovieDetail = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[]; 
  runtime: number;
  vote_count: number;
  genres?: { id: number; name: string }[]; // Géneros opcionales
};

export type CastMember = {
  cast_id: number;
  character: string;
  name: string;
  profile_path: string | null;
};

export type CrewMember = {
  credit_id: string;
  department: string;
  job: string;
  name: string;
  profile_path: string | null;
};