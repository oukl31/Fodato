import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDataStore } from '../lib/store';
import { Calendar, MapPin, Plus, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function SchedulePage() {
  const { matches, teams, stadiums, regions, addMatch, deleteMatch, updateMatch } = useDataStore();
  const [selectedRegion, setSelectedRegion] = useState(0);
  const [selectedDate, setSelectedDate] = useState('2025-11-06');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<number | null>(null);
  
  const filteredMatches = matches
    .filter(m => m.date === selectedDate)
    .filter(m => {
      if (selectedRegion === 0) return true;
      const stadium = stadiums.find(s => s.id === m.stadiumId);
      return stadium?.regionId === selectedRegion;
    })
    .sort((a, b) => a.time.localeCompare(b.time));
  
  const getTeam = (id: number) => teams.find(t => t.id === id);
  const getStadium = (id: number) => stadiums.find(s => s.id === id);
  const getRegion = (stadiumId: number) => {
    const stadium = stadiums.find(s => s.id === stadiumId);
    return regions.find(r => r.id === stadium?.regionId);
  };
  
  const handleAddMatch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    addMatch({
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      sportId: 1,
      stadiumId: Number(formData.get('stadiumId')),
      homeTeamId: Number(formData.get('homeTeamId')),
      awayTeamId: Number(formData.get('awayTeamId')),
      status: 'scheduled'
    });
    
    setIsAddDialogOpen(false);
    e.currentTarget.reset();
  };
  
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this match?')) {
      deleteMatch(id);
    }
  };
  
  const handleUpdateMatch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingMatch) return;
    
    const formData = new FormData(e.currentTarget);
    
    updateMatch(editingMatch, {
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      stadiumId: Number(formData.get('stadiumId')),
      homeTeamId: Number(formData.get('homeTeamId')),
      awayTeamId: Number(formData.get('awayTeamId')),
      status: formData.get('status') as 'scheduled' | 'live' | 'finished'
    });
    
    setEditingMatch(null);
  };
  
  const editMatch = matches.find(m => m.id === editingMatch);
  
  const uniqueDates = Array.from(new Set(matches.map(m => m.date))).sort();
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Calendar className="h-10 w-10 text-primary" />
          <h2>Match Schedule</h2>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-secondary border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
              <Plus className="h-4 w-4 mr-2" />
              Add Match
            </Button>
          </DialogTrigger>
          <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <DialogHeader>
              <DialogTitle>Add New Match</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMatch} className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  name="date" 
                  type="date" 
                  required 
                  className="border-2 border-black"
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input 
                  id="time" 
                  name="time" 
                  type="time" 
                  required 
                  className="border-2 border-black"
                />
              </div>
              <div>
                <Label htmlFor="stadiumId">Stadium</Label>
                <Select name="stadiumId" required>
                  <SelectTrigger className="border-2 border-black">
                    <SelectValue placeholder="Select Stadium" />
                  </SelectTrigger>
                  <SelectContent>
                    {stadiums.map(stadium => (
                      <SelectItem key={stadium.id} value={stadium.id.toString()}>
                        {stadium.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="homeTeamId">Home Team</Label>
                <Select name="homeTeamId" required>
                  <SelectTrigger className="border-2 border-black">
                    <SelectValue placeholder="Select Home Team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map(team => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        {team.logo} {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="awayTeamId">Away Team</Label>
                <Select name="awayTeamId" required>
                  <SelectTrigger className="border-2 border-black">
                    <SelectValue placeholder="Select Away Team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map(team => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        {team.logo} {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Add
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Filters */}
      <div className="space-y-4">
        <div className="bg-white p-4 border-4 border-black rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <Label className="mb-2 block">Select Date</Label>
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="border-2 border-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {uniqueDates.map(date => (
                <SelectItem key={date} value={date}>
                  {date}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="bg-white p-4 border-4 border-black rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <Label className="mb-2 block">Region Filter</Label>
          <div className="flex flex-wrap gap-2">
            {regions.map(region => (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region.id)}
                className={`
                  px-4 py-2 border-2 border-black rounded-sm text-sm
                  ${selectedRegion === region.id 
                    ? 'bg-accent shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                    : 'bg-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  }
                `}
              >
                {region.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Matches Table */}
      <div className="bg-white border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-primary text-white border-b-4 border-black">
                <th className="p-4 text-left border-r-2 border-black">Time</th>
                <th className="p-4 text-left border-r-2 border-black">Match</th>
                <th className="p-4 text-left border-r-2 border-black">Stadium</th>
                <th className="p-4 text-left border-r-2 border-black">Region</th>
                <th className="p-4 text-left border-r-2 border-black">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.map(match => {
                const homeTeam = getTeam(match.homeTeamId);
                const awayTeam = getTeam(match.awayTeamId);
                const stadium = getStadium(match.stadiumId);
                const region = getRegion(match.stadiumId);
                
                return (
                  <tr key={match.id} className="border-b-2 border-black hover:bg-accent/20">
                    <td className="p-4 border-r-2 border-black font-black">{match.time}</td>
                    <td className="p-4 border-r-2 border-black">
                      <div className="flex items-center gap-2">
                        <span>{homeTeam?.logo}</span>
                        <span className="font-black">{homeTeam?.name}</span>
                        <span className="text-primary">vs</span>
                        <span>{awayTeam?.logo}</span>
                        <span className="font-black">{awayTeam?.name}</span>
                      </div>
                    </td>
                    <td className="p-4 border-r-2 border-black">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {stadium?.name}
                      </div>
                    </td>
                    <td className="p-4 border-r-2 border-black">{region?.name}</td>
                    <td className="p-4 border-r-2 border-black">
                      <span className={`
                        px-3 py-1 rounded-sm border-2 border-black text-sm inline-block
                        ${match.status === 'scheduled' ? 'bg-secondary text-white' :
                          match.status === 'live' ? 'bg-accent' : 'bg-gray-300'}
                      `}>
                        {match.status === 'scheduled' ? 'Scheduled' :
                         match.status === 'live' ? 'Live' : 'Finished'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/match/${match.id}`}
                          className="px-3 py-1 bg-primary text-white border-2 border-black rounded-sm text-sm hover:bg-primary/90"
                        >
                          Details
                        </Link>
                        <Dialog open={editingMatch === match.id} onOpenChange={(open) => !open && setEditingMatch(null)}>
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => setEditingMatch(match.id)}
                              className="p-2 bg-accent border-2 border-black rounded-sm hover:bg-accent/90"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">{editMatch && (
                            <>
                              <DialogHeader>
                                <DialogTitle>Edit Match</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={handleUpdateMatch} className="space-y-4">
                                <div>
                                  <Label htmlFor="edit-date">Date</Label>
                                  <Input 
                                    id="edit-date" 
                                    name="date" 
                                    type="date" 
                                    required 
                                    className="border-2 border-black"
                                    defaultValue={editMatch.date}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-time">Time</Label>
                                  <Input 
                                    id="edit-time" 
                                    name="time" 
                                    type="time" 
                                    required 
                                    className="border-2 border-black"
                                    defaultValue={editMatch.time}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-stadiumId">Stadium</Label>
                                  <Select name="stadiumId" required defaultValue={editMatch.stadiumId.toString()}>
                                    <SelectTrigger className="border-2 border-black">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {stadiums.map(stadium => (
                                        <SelectItem key={stadium.id} value={stadium.id.toString()}>
                                          {stadium.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="edit-homeTeamId">Home Team</Label>
                                  <Select name="homeTeamId" required defaultValue={editMatch.homeTeamId.toString()}>
                                    <SelectTrigger className="border-2 border-black">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {teams.map(team => (
                                        <SelectItem key={team.id} value={team.id.toString()}>
                                          {team.logo} {team.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="edit-awayTeamId">Away Team</Label>
                                  <Select name="awayTeamId" required defaultValue={editMatch.awayTeamId.toString()}>
                                    <SelectTrigger className="border-2 border-black">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {teams.map(team => (
                                        <SelectItem key={team.id} value={team.id.toString()}>
                                          {team.logo} {team.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="edit-status">Status</Label>
                                  <Select name="status" required defaultValue={editMatch.status}>
                                    <SelectTrigger className="border-2 border-black">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="scheduled">Scheduled</SelectItem>
                                      <SelectItem value="live">Live</SelectItem>
                                      <SelectItem value="finished">Finished</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button 
                                  type="submit" 
                                  className="w-full bg-primary border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                >
                                  Save Changes
                                </Button>
                              </form>
                            </>
                          )}</DialogContent>
                        </Dialog>
                        <button
                          onClick={() => handleDelete(match.id)}
                          className="p-2 bg-destructive text-white border-2 border-black rounded-sm hover:bg-destructive/90"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {filteredMatches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl">No matches found for the selected criteria.</p>
        </div>
      )}
    </div>
  );
}