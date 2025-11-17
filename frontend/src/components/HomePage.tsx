import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDataStore } from '../lib/store';
import { Calendar, MapPin, TrendingUp } from 'lucide-react';

export function HomePage() {
  const { matches, teams, stadiums, regions, broadcasts, matchStats } = useDataStore();
  const [selectedRegion, setSelectedRegion] = useState(0);
  
  const today = '2025-11-06';
  const todayMatches = matches.filter(m => m.date === today);
  
  const filteredMatches = selectedRegion === 0 
    ? todayMatches 
    : todayMatches.filter(m => {
        const stadium = stadiums.find(s => s.id === m.stadiumId);
        return stadium?.regionId === selectedRegion;
      });
  
  const getTeam = (id: number) => teams.find(t => t.id === id);
  const getStadium = (id: number) => stadiums.find(s => s.id === id);
  const getMatchBroadcasts = (matchId: number) => broadcasts.filter(b => b.matchId === matchId);
  
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-primary text-white p-8 border-4 border-black rounded-sm shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-4 mb-4">
          <Calendar className="h-12 w-12" />
          <div>
            <h2 className="text-4xl font-black">Today's Matches</h2>
            <p className="text-xl mt-2">November 6, 2025 (Thu)</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <TrendingUp className="h-6 w-6" />
          <span className="text-xl">Total {todayMatches.length} matches scheduled</span>
        </div>
      </div>
      
      {/* Region Filter */}
      <div className="bg-white p-6 border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="mb-4">Region Filter</h3>
        <div className="flex flex-wrap gap-3">
          {regions.map(region => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              className={`
                px-6 py-3 border-2 border-black rounded-sm
                transition-all
                ${selectedRegion === region.id 
                  ? 'bg-accent shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' 
                  : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                }
              `}
            >
              {region.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Today's Matches */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredMatches.map(match => {
          const homeTeam = getTeam(match.homeTeamId);
          const awayTeam = getTeam(match.awayTeamId);
          const stadium = getStadium(match.stadiumId);
          const matchBroadcasts = getMatchBroadcasts(match.id);
          
          return (
            <div 
              key={match.id}
              className="bg-white border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            >
              {/* Match Status Header */}
              <div className={`p-3 border-b-4 border-black ${
                match.status === 'scheduled' ? 'bg-secondary' :
                match.status === 'live' ? 'bg-accent' : 'bg-gray-300'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="font-black text-white">
                    {match.status === 'scheduled' ? 'Scheduled' :
                     match.status === 'live' ? 'Live' : 'Finished'}
                  </span>
                  <span className="font-black">{match.time}</span>
                </div>
              </div>
              
              {/* Teams */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1 text-center">
                    <div className="text-4xl mb-2">{homeTeam?.logo}</div>
                    <div className="font-black">{homeTeam?.name}</div>
                  </div>
                  
                  <div className="px-6 text-3xl font-black text-primary">VS</div>
                  
                  <div className="flex-1 text-center">
                    <div className="text-4xl mb-2">{awayTeam?.logo}</div>
                    <div className="font-black">{awayTeam?.name}</div>
                  </div>
                </div>
                
                {/* Stadium */}
                <div className="flex items-center gap-2 justify-center mb-4 p-3 bg-accent/20 border-2 border-black rounded-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{stadium?.name}</span>
                </div>
                
                {/* Broadcasts */}
                {matchBroadcasts.length > 0 && (
                  <div className="space-y-2">
                    <div className="font-black text-sm">Broadcast Channels</div>
                    <div className="flex flex-wrap gap-2">
                      {matchBroadcasts.map(broadcast => (
                        <span 
                          key={broadcast.id}
                          className="px-3 py-1 bg-primary text-white border-2 border-black rounded-sm text-sm"
                        >
                          {broadcast.channelName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Action Button */}
              <Link 
                to={`/match/${match.id}`}
                className="block w-full p-4 bg-primary text-white text-center border-t-4 border-black hover:bg-primary/90 transition-colors"
              >
                View Details →
              </Link>
            </div>
          );
        })}
      </div>
      
      {filteredMatches.length === 0 && (
        <div className="text-center py-12 bg-white border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xl">No matches scheduled in the selected region today.</p>
        </div>
      )}
    </div>
  );
}