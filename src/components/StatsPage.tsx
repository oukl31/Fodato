import { useDataStore } from '../lib/store';
import { BarChart3, TrendingUp, Users, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function StatsPage() {
  const { stadiumStats, stadiums, matches, matchStats, teams, regions } = useDataStore();
  
  // Stadium stats sorted by total matches
  const stadiumChartData = stadiumStats
    .map(stat => {
      const stadium = stadiums.find(s => s.id === stat.stadiumId);
      return {
        name: stadium?.name.split(' Stadium')[0].split(' Park')[0].split(' Field')[0] || '',
        Matches: stat.totalMatches,
        'Avg Attendance': Math.round(stat.avgAttendance / 100) * 100,
        'Max Attendance': Math.round(stat.maxAttendance / 100) * 100
      };
    })
    .sort((a, b) => b.Matches - a.Matches);
  
  // Region distribution
  const regionStats = regions
    .filter(r => r.id !== 0)
    .map(region => {
      const regionStadiums = stadiums.filter(s => s.regionId === region.id);
      const regionMatches = matches.filter(m => 
        regionStadiums.some(s => s.id === m.stadiumId)
      );
      return {
        name: region.name,
        matches: regionMatches.length
      };
    })
    .filter(r => r.matches > 0);
  
  const COLORS = ['#5b61eb', '#ff6b9d', '#ffc857', '#4ecdc4', '#95e1d3', '#f38181', '#aa96da', '#fcbad3'];
  
  // Calculate aggregate statistics
  const totalMatches = matches.length;
  const totalAttendance = matchStats.reduce((sum, stat) => sum + stat.attendance, 0);
  const avgAttendance = totalAttendance / matchStats.length || 0;
  const maxAttendance = Math.max(...matchStats.map(s => s.attendance), 0);
  
  // Top teams by wins (mock data for demonstration)
  const teamWins = teams.map(team => {
    const homeMatches = matchStats.filter(stat => {
      const match = matches.find(m => m.id === stat.matchId);
      return match?.homeTeamId === team.id && stat.homeScore > stat.awayScore;
    }).length;
    
    const awayMatches = matchStats.filter(stat => {
      const match = matches.find(m => m.id === stat.matchId);
      return match?.awayTeamId === team.id && stat.awayScore > stat.homeScore;
    }).length;
    
    return {
      team,
      wins: homeMatches + awayMatches
    };
  }).sort((a, b) => b.wins - a.wins).slice(0, 5);
  
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <BarChart3 className="h-10 w-10 text-primary" />
        <h2>Match Statistics Analysis</h2>
      </div>
      
      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white p-6 border-4 border-black rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div className="font-black">Total Matches</div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-6xl font-black text-primary">{totalMatches}</div>
          </div>
        </div>
        
        <div className="bg-white p-6 border-4 border-black rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <Users className="h-8 w-8 text-secondary" />
            <div className="font-black">Avg Attendance</div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-5xl font-black text-secondary">{Math.round(avgAttendance).toLocaleString()}</div>
          </div>
        </div>
        
        <div className="bg-white p-6 border-4 border-black rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="h-8 w-8 text-accent" />
            <div className="font-black">Max Attendance</div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-5xl font-black" style={{ color: 'var(--accent)' }}>{maxAttendance.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="bg-white p-6 border-4 border-black rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <Award className="h-8 w-8" style={{ color: '#4ecdc4' }} />
            <div className="font-black">Stadiums</div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-6xl font-black" style={{ color: '#4ecdc4' }}>{stadiums.length}</div>
          </div>
        </div>
      </div>
      
      {/* Stadium Stats Chart */}
      <div className="bg-white p-6 border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="mb-6">Stadium Statistics</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={stadiumChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#000" />
            <XAxis 
              dataKey="name" 
              stroke="#000" 
              style={{ fontSize: '14px', fontWeight: 'bold' }}
            />
            <YAxis 
              stroke="#000" 
              style={{ fontSize: '14px', fontWeight: 'bold' }}
            />
            <Tooltip 
              contentStyle={{ 
                border: '2px solid #000', 
                borderRadius: '4px',
                fontWeight: 'bold'
              }}
            />
            <Legend 
              wrapperStyle={{ fontWeight: 'bold' }}
            />
            <Bar dataKey="Matches" fill="#5b61eb" stroke="#000" strokeWidth={2} />
            <Bar dataKey="Avg Attendance" fill="#ff6b9d" stroke="#000" strokeWidth={2} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Region Distribution */}
        <div className="bg-white p-6 border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="mb-6">Regional Match Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regionStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="matches"
                stroke="#000"
                strokeWidth={2}
              >
                {regionStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  border: '2px solid #000', 
                  borderRadius: '4px',
                  fontWeight: 'bold'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Top Teams */}
        <div className="bg-white p-6 border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="mb-6">Team Win Rankings</h3>
          <div className="space-y-3">
            {teamWins.map((item, index) => (
              <div 
                key={item.team.id}
                className="flex items-center gap-4 p-3 border-2 border-black rounded-sm bg-gradient-to-r from-accent/20 to-transparent"
              >
                <div className={`
                  w-10 h-10 flex items-center justify-center
                  border-2 border-black rounded-sm font-black text-xl
                  ${index === 0 ? 'bg-accent' : index === 1 ? 'bg-secondary text-white' : 'bg-white'}
                `}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.team.logo}</span>
                    <span className="font-black">{item.team.name}</span>
                  </div>
                </div>
                <div className="text-2xl font-black text-primary">
                  {item.wins} W
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Stadium Ranking Table */}
      <div className="bg-white border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="bg-primary text-white p-4 border-b-4 border-black">
          <h3 className="font-black">Detailed Stadium Statistics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-accent border-b-4 border-black">
                <th className="p-4 text-left border-r-2 border-black">Rank</th>
                <th className="p-4 text-left border-r-2 border-black">Stadium</th>
                <th className="p-4 text-left border-r-2 border-black">Total Matches</th>
                <th className="p-4 text-left border-r-2 border-black">Avg Attendance</th>
                <th className="p-4 text-left">Max Attendance</th>
              </tr>
            </thead>
            <tbody>
              {stadiumStats
                .map(stat => ({
                  stat,
                  stadium: stadiums.find(s => s.id === stat.stadiumId)
                }))
                .sort((a, b) => b.stat.totalMatches - a.stat.totalMatches)
                .map((item, index) => (
                  <tr key={item.stat.stadiumId} className="border-b-2 border-black hover:bg-secondary/10">
                    <td className="p-4 border-r-2 border-black">
                      <div className={`
                        w-8 h-8 flex items-center justify-center
                        border-2 border-black rounded-sm font-black
                        ${index === 0 ? 'bg-accent' : 'bg-white'}
                      `}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="p-4 border-r-2 border-black font-black">{item.stadium?.name}</td>
                    <td className="p-4 border-r-2 border-black">{item.stat.totalMatches} matches</td>
                    <td className="p-4 border-r-2 border-black">{item.stat.avgAttendance.toLocaleString()}</td>
                    <td className="p-4">{item.stat.maxAttendance.toLocaleString()}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}