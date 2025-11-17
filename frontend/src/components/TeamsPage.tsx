import { useState } from 'react';
import { useDataStore } from '../lib/store';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function TeamsPage() {
  const { teams, matches, matchStats, addTeam, updateTeam, deleteTeam } = useDataStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<number | null>(null);
  
  const getTeamStats = (teamId: number) => {
    const homeMatches = matchStats.filter(stat => {
      const match = matches.find(m => m.id === stat.matchId);
      return match?.homeTeamId === teamId;
    });
    
    const awayMatches = matchStats.filter(stat => {
      const match = matches.find(m => m.id === stat.matchId);
      return match?.awayTeamId === teamId;
    });
    
    const wins = homeMatches.filter(stat => stat.homeScore > stat.awayScore).length +
                 awayMatches.filter(stat => stat.awayScore > stat.homeScore).length;
    
    const losses = homeMatches.filter(stat => stat.homeScore < stat.awayScore).length +
                   awayMatches.filter(stat => stat.awayScore < stat.homeScore).length;
    
    const totalMatches = homeMatches.length + awayMatches.length;
    
    return { wins, losses, totalMatches };
  };
  
  const handleAddTeam = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    addTeam({
      name: formData.get('name') as string,
      logo: formData.get('logo') as string,
      sportId: 1
    });
    
    setIsAddDialogOpen(false);
    e.currentTarget.reset();
  };
  
  const handleUpdateTeam = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTeam) return;
    
    const formData = new FormData(e.currentTarget);
    
    updateTeam(editingTeam, {
      name: formData.get('name') as string,
      logo: formData.get('logo') as string
    });
    
    setEditingTeam(null);
  };
  
  const handleDelete = (id: number) => {
    const teamMatches = matches.filter(m => m.homeTeamId === id || m.awayTeamId === id);
    
    if (teamMatches.length > 0) {
      alert(`Cannot delete this team. It has ${teamMatches.length} associated matches.`);
      return;
    }
    
    if (confirm('Are you sure you want to delete this team?')) {
      deleteTeam(id);
    }
  };
  
  const editTeam = teams.find(t => t.id === editingTeam);
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Users className="h-10 w-10 text-primary" />
          <h2>Team Management</h2>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-secondary border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
              <Plus className="h-4 w-4 mr-2" />
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <DialogHeader>
              <DialogTitle>Add New Team</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTeam} className="space-y-4">
              <div>
                <Label htmlFor="name">Team Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  required 
                  className="border-2 border-black"
                  placeholder="e.g. LG Twins"
                />
              </div>
              <div>
                <Label htmlFor="logo">Team Logo (Emoji)</Label>
                <Input 
                  id="logo" 
                  name="logo" 
                  required 
                  className="border-2 border-black"
                  placeholder="e.g. ⚾"
                  maxLength={2}
                />
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
      
      {/* Teams Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map(team => {
          const stats = getTeamStats(team.id);
          const winRate = stats.totalMatches > 0 
            ? ((stats.wins / stats.totalMatches) * 100).toFixed(1)
            : '0.0';
          
          return (
            <div 
              key={team.id}
              className="bg-white border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            >
              <div className="bg-primary text-white p-6 border-b-4 border-black text-center">
                <div className="text-6xl mb-3">{team.logo}</div>
                <h3 className="font-black text-xl">{team.name}</h3>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-3 bg-accent/20 border-2 border-black rounded-sm text-center">
                    <div className="text-xs font-black mb-1">Matches</div>
                    <div className="text-xl font-black">{stats.totalMatches}</div>
                  </div>
                  <div className="p-3 bg-secondary/20 border-2 border-black rounded-sm text-center">
                    <div className="text-xs font-black mb-1">Wins</div>
                    <div className="text-xl font-black text-primary">{stats.wins}</div>
                  </div>
                  <div className="p-3 bg-accent/20 border-2 border-black rounded-sm text-center">
                    <div className="text-xs font-black mb-1">Losses</div>
                    <div className="text-xl font-black">{stats.losses}</div>
                  </div>
                </div>
                
                <div className="p-3 bg-primary/10 border-2 border-black rounded-sm text-center">
                  <div className="text-xs font-black mb-1">Win Rate</div>
                  <div className="text-2xl font-black text-primary">{winRate}%</div>
                </div>
              </div>
              
              <div className="p-3 border-t-4 border-black flex gap-2">
                <Dialog open={editingTeam === team.id} onOpenChange={(open) => !open && setEditingTeam(null)}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setEditingTeam(team.id)}
                      className="flex-1 px-3 py-2 bg-accent text-black border-2 border-black rounded-sm hover:bg-accent/90 flex items-center justify-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <DialogHeader>
                      <DialogTitle>Edit Team</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpdateTeam} className="space-y-4">
                      <div>
                        <Label htmlFor="edit-name">Team Name</Label>
                        <Input 
                          id="edit-name" 
                          name="name" 
                          required 
                          className="border-2 border-black"
                          defaultValue={editTeam?.name}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-logo">Team Logo (Emoji)</Label>
                        <Input 
                          id="edit-logo" 
                          name="logo" 
                          required 
                          className="border-2 border-black"
                          defaultValue={editTeam?.logo}
                          maxLength={2}
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-primary border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      >
                        Save Changes
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
                
                <button
                  onClick={() => handleDelete(team.id)}
                  className="px-3 py-2 bg-destructive text-white border-2 border-black rounded-sm hover:bg-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {teams.length === 0 && (
        <div className="text-center py-12 bg-white border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xl">No teams found.</p>
        </div>
      )}
    </div>
  );
}