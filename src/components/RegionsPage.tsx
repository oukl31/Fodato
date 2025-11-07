import { useState } from 'react';
import { useDataStore } from '../lib/store';
import { Map, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export function RegionsPage() {
  const { regions, stadiums, matches, teams } = useDataStore();
  const [selectedRegion, setSelectedRegion] = useState(1);
  
  const selectedRegionData = regions.find(r => r.id === selectedRegion);
  const regionStadiums = stadiums.filter(s => s.regionId === selectedRegion);
  const regionMatches = matches.filter(m => 
    regionStadiums.some(s => s.id === m.stadiumId)
  );
  
  const getTeam = (id: number) => teams.find(t => t.id === id);
  const getStadium = (id: number) => stadiums.find(s => s.id === id);
  
  // Calculate regional statistics
  const totalMatches = regionMatches.length;
  const upcomingMatches = regionMatches.filter(m => m.status === 'scheduled').length;
  const finishedMatches = regionMatches.filter(m => m.status === 'finished').length;
  
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Map className="h-10 w-10 text-primary" />
        <h2>Regional Match Distribution</h2>
      </div>
      
      {/* Region Selector */}
      <div className="bg-white p-6 border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="mb-4">Select Region</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {regions.filter(r => r.id !== 0).map(region => {
            const regionStadiumCount = stadiums.filter(s => s.regionId === region.id).length;
            const regionMatchCount = matches.filter(m => 
              stadiums.some(s => s.id === m.stadiumId && s.regionId === region.id)
            ).length;
            
            return (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region.id)}
                className={`
                  p-4 border-2 border-black rounded-sm text-left
                  transition-all
                  ${selectedRegion === region.id 
                    ? 'bg-primary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' 
                    : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                  }
                `}
              >
                <div className="font-black text-xl mb-2">{region.name}</div>
                <div className={`text-sm ${selectedRegion === region.id ? 'opacity-90' : 'text-muted-foreground'}`}>
                  {regionStadiumCount} stadiums · {regionMatchCount} matches
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {selectedRegionData && (
        <>
          {/* Region Overview */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-8 border-4 border-black rounded-sm shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-4xl font-black mb-6">{selectedRegionData.name} Region</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white/20 border-2 border-white rounded-sm backdrop-blur">
                <div className="text-sm opacity-90 mb-1">Total Stadiums</div>
                <div className="text-3xl font-black">{regionStadiums.length}</div>
              </div>
              <div className="p-4 bg-white/20 border-2 border-white rounded-sm backdrop-blur">
                <div className="text-sm opacity-90 mb-1">Total Matches</div>
                <div className="text-3xl font-black">{totalMatches}</div>
              </div>
              <div className="p-4 bg-white/20 border-2 border-white rounded-sm backdrop-blur">
                <div className="text-sm opacity-90 mb-1">Upcoming</div>
                <div className="text-3xl font-black">{upcomingMatches}</div>
              </div>
            </div>
          </div>
          
          {/* Stadiums in Region */}
          <div className="bg-white p-6 border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="h-6 w-6 text-primary" />
              <h3>Stadium List</h3>
            </div>
            
            {regionStadiums.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {regionStadiums.map(stadium => {
                  const stadiumMatches = matches.filter(m => m.stadiumId === stadium.id);
                  
                  return (
                    <div 
                      key={stadium.id}
                      className="p-4 border-2 border-black rounded-sm bg-accent/10 hover:bg-accent/20 transition-colors"
                    >
                      <div className="font-black text-lg mb-2">{stadium.name}</div>
                      <div className="text-sm text-muted-foreground mb-3">{stadium.location}</div>
                      <div className="flex justify-between items-center pt-3 border-t-2 border-black">
                        <div className="text-sm">
                          {stadium.capacity.toLocaleString()} seats · {stadiumMatches.length} matches
                        </div>
                        <Link
                          to={`/stadiums/${stadium.id}`}
                          className="px-3 py-1 bg-primary text-white border-2 border-black rounded-sm text-sm hover:bg-primary/90"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No stadiums in this region.
              </div>
            )}
          </div>
          
          {/* Matches in Region */}
          <div className="bg-white p-6 border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-6 w-6 text-primary" />
              <h3>Match Schedule</h3>
            </div>
            
            {regionMatches.length > 0 ? (
              <div className="space-y-3">
                {regionMatches.slice(0, 10).map(match => {
                  const homeTeam = getTeam(match.homeTeamId);
                  const awayTeam = getTeam(match.awayTeamId);
                  const stadium = getStadium(match.stadiumId);
                  
                  return (
                    <div 
                      key={match.id}
                      className="p-4 border-2 border-black rounded-sm hover:bg-secondary/10 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="font-black">{match.date}</div>
                          <div className="text-sm text-muted-foreground">{match.time}</div>
                        </div>
                        <span className={`
                          px-3 py-1 rounded-sm border-2 border-black text-sm
                          ${match.status === 'scheduled' ? 'bg-secondary text-white' :
                            match.status === 'live' ? 'bg-accent' : 'bg-gray-300'}
                        `}>
                          {match.status === 'scheduled' ? 'Scheduled' :
                           match.status === 'live' ? 'Live' : 'Finished'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{homeTeam?.logo}</span>
                          <span className="font-black">{homeTeam?.name}</span>
                          <span className="text-primary">vs</span>
                          <span>{awayTeam?.logo}</span>
                          <span className="font-black">{awayTeam?.name}</span>
                        </div>
                        <Link
                          to={`/match/${match.id}`}
                          className="px-3 py-1 bg-primary text-white border-2 border-black rounded-sm text-sm hover:bg-primary/90"
                        >
                          Details
                        </Link>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t-2 border-black text-sm">
                        📍 {stadium?.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No scheduled matches in this region.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
