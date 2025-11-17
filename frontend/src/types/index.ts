export interface Sport {
  id: number;
  name: string;
}

export interface Region {
  id: number;
  name: string;
}

export interface Stadium {
  id: number;
  name: string;
  location: string;
  capacity: number;
  regionId: number;
  sportId: number;
}

export interface Team {
  id: number;
  name: string;
  logo: string;
  sportId: number;
  regionId: number;
}

export interface Match {
  id: number;
  date: string;
  time: string;
  sportId: number;
  stadiumId: number;
  homeTeamId: number;
  awayTeamId: number;
  status: 'scheduled' | 'live' | 'finished';
}

export interface Broadcast {
  id: number;
  matchId: number;
  channelName: string;
  link: string;
}

export interface MatchStat {
  id: number;
  matchId: number;
  homeScore: number;
  awayScore: number;
  attendance: number;
  highlights?: string;
}

export interface StadiumStat {
  stadiumId: number;
  totalMatches: number;
  maxAttendance: number;
  avgAttendance: number;
  mostPlayedSport: string;
}
