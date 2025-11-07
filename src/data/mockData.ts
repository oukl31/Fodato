import { Sport, Region, Stadium, Team, Match, Broadcast, MatchStat, StadiumStat } from '../types';

export const sports: Sport[] = [
  { id: 1, name: 'Baseball' }
];

export const regions: Region[] = [
  { id: 0, name: 'All' },
  { id: 1, name: 'Seoul' },
  { id: 2, name: 'Incheon' },
  { id: 3, name: 'Suwon' },
  { id: 4, name: 'Daejeon' },
  { id: 5, name: 'Gwangju' },
  { id: 6, name: 'Daegu' },
  { id: 7, name: 'Busan' },
  { id: 8, name: 'Changwon' }
];

export const stadiums: Stadium[] = [
  { id: 1, name: 'Jamsil Baseball Stadium', location: 'Songpa-gu, Seoul', capacity: 25000, regionId: 1, sportId: 1 },
  { id: 2, name: 'Gocheok Sky Dome', location: 'Guro-gu, Seoul', capacity: 18000, regionId: 1, sportId: 1 },
  { id: 3, name: 'Incheon SSG Landers Field', location: 'Michuhol-gu, Incheon', capacity: 20000, regionId: 2, sportId: 1 },
  { id: 4, name: 'Suwon KT Wiz Park', location: 'Jangan-gu, Suwon', capacity: 18000, regionId: 3, sportId: 1 },
  { id: 5, name: 'Daejeon Hanwha Life Eagles Park', location: 'Jung-gu, Daejeon', capacity: 13000, regionId: 4, sportId: 1 },
  { id: 6, name: 'Gwangju-KIA Champions Field', location: 'Buk-gu, Gwangju', capacity: 11000, regionId: 5, sportId: 1 },
  { id: 7, name: 'Daegu Samsung Lions Park', location: 'Suseong-gu, Daegu', capacity: 24000, regionId: 6, sportId: 1 },
  { id: 8, name: 'Sajik Baseball Stadium', location: 'Dongnae-gu, Busan', capacity: 28000, regionId: 7, sportId: 1 },
  { id: 9, name: 'Changwon NC Park', location: 'Masanhoe won-gu, Changwon', capacity: 13000, regionId: 8, sportId: 1 }
];

export const teams: Team[] = [
  { id: 1, name: 'LG Twins', logo: '🦁', sportId: 1, regionId: 1 },
  { id: 2, name: 'Doosan Bears', logo: '🐻', sportId: 1, regionId: 1 },
  { id: 3, name: 'Kiwoom Heroes', logo: '🦸', sportId: 1, regionId: 1 },
  { id: 4, name: 'SSG Landers', logo: '⚡', sportId: 1, regionId: 2 },
  { id: 5, name: 'KT Wiz', logo: '🧙', sportId: 1, regionId: 3 },
  { id: 6, name: 'Hanwha Eagles', logo: '🦅', sportId: 1, regionId: 4 },
  { id: 7, name: 'KIA Tigers', logo: '🐯', sportId: 1, regionId: 5 },
  { id: 8, name: 'Samsung Lions', logo: '🦁', sportId: 1, regionId: 6 },
  { id: 9, name: 'Lotte Giants', logo: '⚾', sportId: 1, regionId: 7 },
  { id: 10, name: 'NC Dinos', logo: '🦕', sportId: 1, regionId: 8 }
];

export const matches: Match[] = [
  { id: 1, date: '2025-11-06', time: '18:30', sportId: 1, stadiumId: 1, homeTeamId: 1, awayTeamId: 2, status: 'scheduled' },
  { id: 2, date: '2025-11-06', time: '18:30', sportId: 1, stadiumId: 3, homeTeamId: 4, awayTeamId: 5, status: 'scheduled' },
  { id: 3, date: '2025-11-06', time: '18:30', sportId: 1, stadiumId: 6, homeTeamId: 7, awayTeamId: 8, status: 'scheduled' },
  { id: 4, date: '2025-11-06', time: '18:30', sportId: 1, stadiumId: 8, homeTeamId: 9, awayTeamId: 10, status: 'scheduled' },
  { id: 5, date: '2025-11-07', time: '18:30', sportId: 1, stadiumId: 2, homeTeamId: 3, awayTeamId: 6, status: 'scheduled' },
  { id: 6, date: '2025-11-07', time: '18:30', sportId: 1, stadiumId: 4, homeTeamId: 5, awayTeamId: 4, status: 'scheduled' },
  { id: 7, date: '2025-11-07', time: '18:30', sportId: 1, stadiumId: 7, homeTeamId: 8, awayTeamId: 7, status: 'scheduled' },
  { id: 8, date: '2025-11-05', time: '18:30', sportId: 1, stadiumId: 1, homeTeamId: 1, awayTeamId: 3, status: 'finished' },
  { id: 9, date: '2025-11-05', time: '18:30', sportId: 1, stadiumId: 3, homeTeamId: 4, awayTeamId: 2, status: 'finished' },
  { id: 10, date: '2025-11-05', time: '18:30', sportId: 1, stadiumId: 6, homeTeamId: 7, awayTeamId: 9, status: 'finished' }
];

export const broadcasts: Broadcast[] = [
  { id: 1, matchId: 1, channelName: 'KBS N SPORTS', link: 'https://sports.kbs.co.kr' },
  { id: 2, matchId: 1, channelName: 'SPOTV', link: 'https://spotv.net' },
  { id: 3, matchId: 2, channelName: 'MBC SPORTS+', link: 'https://mbcsportsplus.com' },
  { id: 4, matchId: 3, channelName: 'KBS N SPORTS', link: 'https://sports.kbs.co.kr' },
  { id: 5, matchId: 4, channelName: 'SPOTV', link: 'https://spotv.net' },
  { id: 6, matchId: 5, channelName: 'KBS N SPORTS', link: 'https://sports.kbs.co.kr' },
  { id: 7, matchId: 6, channelName: 'MBC SPORTS+', link: 'https://mbcsportsplus.com' },
  { id: 8, matchId: 7, channelName: 'SPOTV', link: 'https://spotv.net' },
  { id: 9, matchId: 8, channelName: 'KBS N SPORTS', link: 'https://sports.kbs.co.kr' },
  { id: 10, matchId: 9, channelName: 'SPOTV', link: 'https://spotv.net' },
  { id: 11, matchId: 10, channelName: 'MBC SPORTS+', link: 'https://mbcsportsplus.com' }
];

export const matchStats: MatchStat[] = [
  { id: 1, matchId: 8, homeScore: 5, awayScore: 3, attendance: 18500, highlights: '2 home runs' },
  { id: 2, matchId: 9, homeScore: 2, awayScore: 4, attendance: 15200, highlights: 'Come-from-behind win' },
  { id: 3, matchId: 10, homeScore: 7, awayScore: 1, attendance: 9800, highlights: 'Complete game shutout' }
];

export const stadiumStats: StadiumStat[] = [
  { stadiumId: 1, totalMatches: 72, maxAttendance: 24500, avgAttendance: 19200, mostPlayedSport: 'Baseball' },
  { stadiumId: 2, totalMatches: 68, maxAttendance: 17800, avgAttendance: 14500, mostPlayedSport: 'Baseball' },
  { stadiumId: 3, totalMatches: 70, maxAttendance: 19500, avgAttendance: 16800, mostPlayedSport: 'Baseball' },
  { stadiumId: 4, totalMatches: 69, maxAttendance: 17600, avgAttendance: 15200, mostPlayedSport: 'Baseball' },
  { stadiumId: 5, totalMatches: 71, maxAttendance: 12800, avgAttendance: 10500, mostPlayedSport: 'Baseball' },
  { stadiumId: 6, totalMatches: 73, maxAttendance: 10800, avgAttendance: 9200, mostPlayedSport: 'Baseball' },
  { stadiumId: 7, totalMatches: 72, maxAttendance: 23500, avgAttendance: 18900, mostPlayedSport: 'Baseball' },
  { stadiumId: 8, totalMatches: 74, maxAttendance: 27500, avgAttendance: 21300, mostPlayedSport: 'Baseball' },
  { stadiumId: 9, totalMatches: 70, maxAttendance: 12700, avgAttendance: 10800, mostPlayedSport: 'Baseball' }
];
