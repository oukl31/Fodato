import { create } from 'zustand';
import { 
  sports as initialSports, 
  regions as initialRegions, 
  stadiums as initialStadiums,
  teams as initialTeams,
  matches as initialMatches,
  broadcasts as initialBroadcasts,
  matchStats as initialMatchStats,
  stadiumStats as initialStadiumStats
} from '../data/mockData';
import { Sport, Region, Stadium, Team, Match, Broadcast, MatchStat, StadiumStat } from '../types';

interface DataStore {
  sports: Sport[];
  regions: Region[];
  stadiums: Stadium[];
  teams: Team[];
  matches: Match[];
  broadcasts: Broadcast[];
  matchStats: MatchStat[];
  stadiumStats: StadiumStat[];
  
  // CRUD operations
  addMatch: (match: Omit<Match, 'id'>) => void;
  updateMatch: (id: number, match: Partial<Match>) => void;
  deleteMatch: (id: number) => void;
  
  addBroadcast: (broadcast: Omit<Broadcast, 'id'>) => void;
  updateBroadcast: (id: number, broadcast: Partial<Broadcast>) => void;
  deleteBroadcast: (id: number) => void;
  
  addMatchStat: (stat: Omit<MatchStat, 'id'>) => void;
  updateMatchStat: (id: number, stat: Partial<MatchStat>) => void;
  
  addStadium: (stadium: Omit<Stadium, 'id'>) => void;
  updateStadium: (id: number, stadium: Partial<Stadium>) => void;
  deleteStadium: (id: number) => void;
  
  addTeam: (team: Omit<Team, 'id'>) => void;
  updateTeam: (id: number, team: Partial<Team>) => void;
  deleteTeam: (id: number) => void;
}

export const useDataStore = create<DataStore>((set) => ({
  sports: initialSports,
  regions: initialRegions,
  stadiums: initialStadiums,
  teams: initialTeams,
  matches: initialMatches,
  broadcasts: initialBroadcasts,
  matchStats: initialMatchStats,
  stadiumStats: initialStadiumStats,
  
  addMatch: (match) => set((state) => ({
    matches: [...state.matches, { ...match, id: Math.max(...state.matches.map(m => m.id)) + 1 }]
  })),
  
  updateMatch: (id, match) => set((state) => ({
    matches: state.matches.map(m => m.id === id ? { ...m, ...match } : m)
  })),
  
  deleteMatch: (id) => set((state) => ({
    matches: state.matches.filter(m => m.id !== id),
    broadcasts: state.broadcasts.filter(b => b.matchId !== id),
    matchStats: state.matchStats.filter(ms => ms.matchId !== id)
  })),
  
  addBroadcast: (broadcast) => set((state) => ({
    broadcasts: [...state.broadcasts, { ...broadcast, id: Math.max(...state.broadcasts.map(b => b.id)) + 1 }]
  })),
  
  updateBroadcast: (id, broadcast) => set((state) => ({
    broadcasts: state.broadcasts.map(b => b.id === id ? { ...b, ...broadcast } : b)
  })),
  
  deleteBroadcast: (id) => set((state) => ({
    broadcasts: state.broadcasts.filter(b => b.id !== id)
  })),
  
  addMatchStat: (stat) => set((state) => ({
    matchStats: [...state.matchStats, { ...stat, id: Math.max(0, ...state.matchStats.map(ms => ms.id)) + 1 }]
  })),
  
  updateMatchStat: (id, stat) => set((state) => ({
    matchStats: state.matchStats.map(ms => ms.id === id ? { ...ms, ...stat } : ms)
  })),
  
  addStadium: (stadium) => set((state) => ({
    stadiums: [...state.stadiums, { ...stadium, id: Math.max(...state.stadiums.map(s => s.id)) + 1 }]
  })),
  
  updateStadium: (id, stadium) => set((state) => ({
    stadiums: state.stadiums.map(s => s.id === id ? { ...s, ...stadium } : s)
  })),
  
  deleteStadium: (id) => set((state) => ({
    stadiums: state.stadiums.filter(s => s.id !== id)
  })),
  
  addTeam: (team) => set((state) => ({
    teams: [...state.teams, { ...team, id: Math.max(...state.teams.map(t => t.id)) + 1 }]
  })),
  
  updateTeam: (id, team) => set((state) => ({
    teams: state.teams.map(t => t.id === id ? { ...t, ...team } : t)
  })),
  
  deleteTeam: (id) => set((state) => ({
    teams: state.teams.filter(t => t.id !== id)
  }))
}));
