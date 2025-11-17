import { useParams, Link } from 'react-router-dom';
import { useDataStore } from '../lib/store';
import { MapPin, Clock, Radio, TrendingUp, ArrowLeft, Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function MatchDetailPage() {
  const { id } = useParams();
  const { matches, teams, stadiums, broadcasts, matchStats, addBroadcast, deleteBroadcast, updateBroadcast, addMatchStat, updateMatchStat } = useDataStore();
  const [isAddBroadcastOpen, setIsAddBroadcastOpen] = useState(false);
  const [isEditStatOpen, setIsEditStatOpen] = useState(false);
  const [editingBroadcast, setEditingBroadcast] = useState<number | null>(null);
  
  const matchId = Number(id);
  const match = matches.find(m => m.id === matchId);
  const homeTeam = teams.find(t => t.id === match?.homeTeamId);
  const awayTeam = teams.find(t => t.id === match?.awayTeamId);
  const stadium = stadiums.find(s => s.id === match?.stadiumId);
  const matchBroadcasts = broadcasts.filter(b => b.matchId === matchId);
  const matchStat = matchStats.find(ms => ms.matchId === matchId);
  
  if (!match) {
    return (
      <div className="text-center py-12">
        <h2>Match Not Found</h2>
        <Link to="/schedule" className="text-primary underline mt-4 inline-block">
          Back to Schedule
        </Link>
      </div>
    );
  }
  
  const handleAddBroadcast = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    addBroadcast({
      matchId,
      channelName: formData.get('channelName') as string,
      link: formData.get('link') as string
    });
    
    setIsAddBroadcastOpen(false);
    e.currentTarget.reset();
  };
  
  const handleSaveStat = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const statData = {
      matchId,
      homeScore: Number(formData.get('homeScore')),
      awayScore: Number(formData.get('awayScore')),
      attendance: Number(formData.get('attendance')),
      highlights: formData.get('highlights') as string
    };
    
    if (matchStat) {
      updateMatchStat(matchStat.id, statData);
    } else {
      addMatchStat(statData);
    }
    
    setIsEditStatOpen(false);
  };
  
  const handleUpdateBroadcast = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (editingBroadcast) {
      updateBroadcast(editingBroadcast, {
        matchId,
        channelName: formData.get('channelName') as string,
        link: formData.get('link') as string
      });
    }
    
    setIsAddBroadcastOpen(false);
    e.currentTarget.reset();
    setEditingBroadcast(null);
  };
  
  const editBroadcast = broadcasts.find(b => b.id === editingBroadcast);

  return (
    <div className="space-y-8">
      <Link 
        to="/schedule"
        className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Schedule
      </Link>
      
      {/* Match Header */}
      <div className="bg-primary text-white p-8 border-4 border-black rounded-sm shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8" />
            <div>
              <div className="text-2xl font-black">{match.date}</div>
              <div className="text-xl">{match.time}</div>
            </div>
          </div>
          <span className={`
            px-6 py-3 rounded-sm border-2 border-white text-xl font-black
            ${match.status === 'scheduled' ? 'bg-secondary' :
              match.status === 'live' ? 'bg-accent text-black' : 'bg-gray-600'}
          `}>
            {match.status === 'scheduled' ? 'Scheduled' :
             match.status === 'live' ? 'Live' : 'Finished'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <div className="text-6xl mb-4">{homeTeam?.logo}</div>
            <div className="text-3xl font-black">{homeTeam?.name}</div>
            {matchStat && (
              <div className="text-5xl font-black mt-4">{matchStat.homeScore}</div>
            )}
          </div>
          
          <div className="px-8 text-4xl font-black">VS</div>
          
          <div className="flex-1 text-center">
            <div className="text-6xl mb-4">{awayTeam?.logo}</div>
            <div className="text-3xl font-black">{awayTeam?.name}</div>
            {matchStat && (
              <div className="text-5xl font-black mt-4">{matchStat.awayScore}</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Stadium Info */}
        <div className="bg-white p-6 border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-6 w-6 text-primary" />
            <h3>Stadium Information</h3>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-accent/20 border-2 border-black rounded-sm">
              <div className="font-black mb-1">Stadium</div>
              <div>{stadium?.name}</div>
            </div>
            <div className="p-4 bg-accent/20 border-2 border-black rounded-sm">
              <div className="font-black mb-1">Location</div>
              <div>{stadium?.location}</div>
            </div>
            <div className="p-4 bg-accent/20 border-2 border-black rounded-sm">
              <div className="font-black mb-1">Capacity</div>
              <div>{stadium?.capacity.toLocaleString()} seats</div>
            </div>
          </div>
          <Link
            to={`/stadiums/${stadium?.id}`}
            className="block w-full mt-4 p-3 bg-primary text-white text-center border-2 border-black rounded-sm hover:bg-primary/90"
          >
            View Stadium Details →
          </Link>
        </div>
        
        {/* Statistics */}
        <div className="bg-white p-6 border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h3>Match Statistics</h3>
            </div>
            <Dialog open={isEditStatOpen} onOpenChange={setIsEditStatOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="sm"
                  className="bg-accent border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {matchStat ? 'Edit' : 'Add'}
                </Button>
              </DialogTrigger>
              <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <DialogHeader>
                  <DialogTitle>Match Statistics {matchStat ? 'Edit' : 'Add'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSaveStat} className="space-y-4">
                  <div>
                    <Label htmlFor="homeScore">Home Team Score</Label>
                    <Input 
                      id="homeScore" 
                      name="homeScore" 
                      type="number" 
                      defaultValue={matchStat?.homeScore || 0}
                      required 
                      className="border-2 border-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="awayScore">Away Team Score</Label>
                    <Input 
                      id="awayScore" 
                      name="awayScore" 
                      type="number" 
                      defaultValue={matchStat?.awayScore || 0}
                      required 
                      className="border-2 border-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="attendance">Attendance</Label>
                    <Input 
                      id="attendance" 
                      name="attendance" 
                      type="number" 
                      defaultValue={matchStat?.attendance || 0}
                      required 
                      className="border-2 border-black"
                    />
                  </div>
                  <div>
                    <Label htmlFor="highlights">Highlights</Label>
                    <Input 
                      id="highlights" 
                      name="highlights" 
                      defaultValue={matchStat?.highlights || ''}
                      className="border-2 border-black"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Save
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          {matchStat ? (
            <div className="space-y-3">
              <div className="p-4 bg-secondary/20 border-2 border-black rounded-sm">
                <div className="font-black mb-1">Attendance</div>
                <div className="text-2xl">{matchStat.attendance.toLocaleString()}</div>
              </div>
              {matchStat.highlights && (
                <div className="p-4 bg-secondary/20 border-2 border-black rounded-sm">
                  <div className="font-black mb-1">Highlights</div>
                  <div>{matchStat.highlights}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No match statistics entered yet
            </div>
          )}
        </div>
      </div>
      
      {/* Broadcast Info */}
      <div className="bg-white p-6 border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Radio className="h-6 w-6 text-primary" />
            <h3>Broadcast Information</h3>
          </div>
          <Dialog open={isAddBroadcastOpen} onOpenChange={setIsAddBroadcastOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-secondary border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Broadcast
              </Button>
            </DialogTrigger>
            <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <DialogHeader>
                <DialogTitle>Add Broadcast Information</DialogTitle>
              </DialogHeader>
              <form onSubmit={editingBroadcast ? handleUpdateBroadcast : handleAddBroadcast} className="space-y-4">
                <div>
                  <Label htmlFor="channelName">Channel Name</Label>
                  <Input 
                    id="channelName" 
                    name="channelName" 
                    required 
                    className="border-2 border-black"
                    placeholder="e.g. KBS N SPORTS"
                    defaultValue={editBroadcast?.channelName || ''}
                  />
                </div>
                <div>
                  <Label htmlFor="link">Link</Label>
                  <Input 
                    id="link" 
                    name="link" 
                    type="url" 
                    required 
                    className="border-2 border-black"
                    placeholder="https://..."
                    defaultValue={editBroadcast?.link || ''}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  {editingBroadcast ? 'Update' : 'Add'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {matchBroadcasts.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {matchBroadcasts.map(broadcast => (
              <div 
                key={broadcast.id}
                className="p-4 border-2 border-black rounded-sm bg-primary/5 flex justify-between items-center"
              >
                <div>
                  <div className="font-black mb-1">{broadcast.channelName}</div>
                  <a 
                    href={broadcast.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline text-sm"
                  >
                    {broadcast.link}
                  </a>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingBroadcast(broadcast.id);
                      setIsAddBroadcastOpen(true);
                    }}
                    className="p-2 bg-accent text-black border-2 border-black rounded-sm hover:bg-accent/90"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this broadcast?')) {
                        deleteBroadcast(broadcast.id);
                      }
                    }}
                    className="p-2 bg-destructive text-white border-2 border-black rounded-sm hover:bg-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No broadcast information available
          </div>
        )}
      </div>
    </div>
  );
}