import { useParams, Link } from 'react-router-dom';
import { useDataStore } from '../lib/store';
import { MapPin, Users, TrendingUp, Calendar, ArrowLeft } from 'lucide-react';

export function StadiumDetailPage() {
  const { id } = useParams();
  const { stadiums, regions, matches, teams, stadiumStats, matchStats } = useDataStore();
  
  const stadiumId = Number(id);
  const stadium = stadiums.find(s => s.id === stadiumId);
  const region = regions.find(r => r.id === stadium?.regionId);
  const stadiumMatches = matches.filter(m => m.stadiumId === stadiumId);
  const stat = stadiumStats.find(s => s.stadiumId === stadiumId);
  
  if (!stadium) {
    return (
      <div className="text-center py-12">
        <h2>Stadium Not Found</h2>
        <Link to="/stadiums" className="text-primary underline mt-4 inline-block">
          Back to Stadium List
        </Link>
      </div>
    );
  }
  
  const getTeam = (id: number) => teams.find(t => t.id === id);
  
  const upcomingMatches = stadiumMatches.filter(m => m.status === 'scheduled');
  const finishedMatches = stadiumMatches.filter(m => m.status === 'finished');
  
  return (
    <div className="space-y-8">
      <Link 
        to="/stadiums"
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Stadium List
      </Link>
      
      {/* Stadium Header */}
      <div className="bg-primary text-white p-8 border-4 border-black rounded-sm shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-sm opacity-90 mb-2">{region?.name}</div>
            <h2 className="text-4xl font-black mb-3">{stadium.name}</h2>
            <div className="flex items-center gap-2 text-xl">
              <MapPin className="h-6 w-6" />
              <span>{stadium.location}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90 mb-2">Capacity</div>
            <div className="text-4xl font-black">{stadium.capacity.toLocaleString()}</div>
            <div className="text-sm opacity-90">seats</div>
          </div>
        </div>
      </div>
      
      {/* Statistics */}
      {stat && (
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white p-6 border-4 border-black rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="h-8 w-8 text-primary" />
              <div className="font-black text-sm">Total Matches</div>
            </div>
            <div className="text-4xl font-black text-primary">{stat.totalMatches}</div>
          </div>
          
          <div className="bg-white p-6 border-4 border-black rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-8 w-8 text-secondary" />
              <div className="font-black text-sm">Avg Attendance</div>
            </div>
            <div className="text-4xl font-black text-secondary">{stat.avgAttendance.toLocaleString()}</div>
          </div>
          
          <div className="bg-white p-6 border-4 border-black rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="h-8 w-8 text-accent" />
              <div className="font-black text-sm">Max Attendance</div>
            </div>
            <div className="text-4xl font-black" style={{ color: 'var(--accent)' }}>{stat.maxAttendance.toLocaleString()}</div>
          </div>
          
          <div className="bg-white p-6 border-4 border-black rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">⚾</div>
              <div className="font-black text-sm">Main Sport</div>
            </div>
            <div className="text-4xl font-black">{stat.mostPlayedSport}</div>
          </div>
        </div>
      )}
      
      {/* Upcoming Matches */}
      <div className="bg-white p-6 border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="mb-6">Upcoming Matches</h3>
        
        {upcomingMatches.length > 0 ? (
          <div className="space-y-3">
            {upcomingMatches.map(match => {
              const homeTeam = getTeam(match.homeTeamId);
              const awayTeam = getTeam(match.awayTeamId);
              
              return (
                <div 
                  key={match.id}
                  className="p-4 border-2 border-black rounded-sm bg-accent/10 hover:bg-accent/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="font-black">{match.date}</div>
                      <div className="text-sm text-muted-foreground">{match.time}</div>
                    </div>
                    <span className="px-3 py-1 bg-secondary text-white border-2 border-black rounded-sm text-sm">
                      Scheduled
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
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No upcoming matches.
          </div>
        )}
      </div>
      
      {/* Past Matches */}
      <div className="bg-white p-6 border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="mb-6">Past Matches</h3>
        
        {finishedMatches.length > 0 ? (
          <div className="space-y-3">
            {finishedMatches.slice(0, 5).map(match => {
              const homeTeam = getTeam(match.homeTeamId);
              const awayTeam = getTeam(match.awayTeamId);
              const stat = matchStats.find(ms => ms.matchId === match.id);
              
              return (
                <div 
                  key={match.id}
                  className="p-4 border-2 border-black rounded-sm bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="font-black">{match.date}</div>
                      <div className="text-sm text-muted-foreground">{match.time}</div>
                    </div>
                    <span className="px-3 py-1 bg-gray-300 border-2 border-black rounded-sm text-sm">
                      Finished
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span>{homeTeam?.logo}</span>
                        <span className="font-black">{homeTeam?.name}</span>
                        {stat && <span className="text-2xl font-black text-primary">{stat.homeScore}</span>}
                      </div>
                      <span className="text-muted-foreground">vs</span>
                      <div className="flex items-center gap-2">
                        {stat && <span className="text-2xl font-black text-secondary">{stat.awayScore}</span>}
                        <span>{awayTeam?.logo}</span>
                        <span className="font-black">{awayTeam?.name}</span>
                      </div>
                    </div>
                    <Link
                      to={`/match/${match.id}`}
                      className="px-3 py-1 bg-primary text-white border-2 border-black rounded-sm text-sm hover:bg-primary/90"
                    >
                      Details
                    </Link>
                  </div>
                  
                  {stat && (
                    <div className="mt-3 pt-3 border-t-2 border-black text-sm">
                      👥 Attendance: {stat.attendance.toLocaleString()}
                      {stat.highlights && ` · 🎯 ${stat.highlights}`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No past match records.
          </div>
        )}
      </div>
    </div>
  );
}
