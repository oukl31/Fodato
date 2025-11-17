import { useDataStore } from '../lib/store';
import { Radio, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export function BroadcastsPage() {
  const { broadcasts, matches, teams, stadiums } = useDataStore();
  
  const channelGroups = broadcasts.reduce((acc, broadcast) => {
    if (!acc[broadcast.channelName]) {
      acc[broadcast.channelName] = [];
    }
    acc[broadcast.channelName].push(broadcast);
    return acc;
  }, {} as Record<string, typeof broadcasts>);
  
  const getMatch = (matchId: number) => matches.find(m => m.id === matchId);
  const getTeam = (id: number) => teams.find(t => t.id === id);
  const getStadium = (id: number) => stadiums.find(s => s.id === id);
  
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Radio className="h-10 w-10 text-primary" />
        <h2>Broadcast Information</h2>
      </div>
      
      <div className="space-y-6">
        {Object.entries(channelGroups).map(([channelName, channelBroadcasts]) => (
          <div 
            key={channelName}
            className="bg-white border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
          >
            <div className="bg-primary text-white p-4 border-b-4 border-black">
              <div className="flex items-center gap-3">
                <Radio className="h-6 w-6" />
                <div>
                  <h3 className="font-black text-xl">{channelName}</h3>
                  <p className="text-sm opacity-90">{channelBroadcasts.length} match broadcasts</p>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-3">
                {channelBroadcasts.map(broadcast => {
                  const match = getMatch(broadcast.matchId);
                  if (!match) return null;
                  
                  const homeTeam = getTeam(match.homeTeamId);
                  const awayTeam = getTeam(match.awayTeamId);
                  const stadium = getStadium(match.stadiumId);
                  
                  return (
                    <div 
                      key={broadcast.id}
                      className="p-4 border-2 border-black rounded-sm bg-accent/10 hover:bg-accent/20 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-black">{match.date}</div>
                            <div className="text-sm">{match.time}</div>
                          </div>
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
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span>{homeTeam?.logo}</span>
                        <span className="font-black">{homeTeam?.name}</span>
                        <span className="text-primary">vs</span>
                        <span>{awayTeam?.logo}</span>
                        <span className="font-black">{awayTeam?.name}</span>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t-2 border-black">
                        <div className="text-sm">
                          📍 {stadium?.name}
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={broadcast.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-secondary text-white border-2 border-black rounded-sm text-sm hover:bg-secondary/90"
                          >
                            Watch Live
                          </a>
                          <Link
                            to={`/match/${match.id}`}
                            className="px-3 py-1 bg-primary text-white border-2 border-black rounded-sm text-sm hover:bg-primary/90"
                          >
                            Match Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {broadcasts.length === 0 && (
        <div className="text-center py-12 bg-white border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xl">No broadcast information available.</p>
        </div>
      )}
    </div>
  );
}
