import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDataStore } from '../lib/store';
import { MapPin, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function StadiumsPage() {
  const { stadiums, regions, stadiumStats, matches, addStadium, deleteStadium, updateStadium } = useDataStore();
  const [selectedRegion, setSelectedRegion] = useState(0);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStadium, setEditingStadium] = useState<number | null>(null);
  
  const filteredStadiums = selectedRegion === 0 
    ? stadiums 
    : stadiums.filter(s => s.regionId === selectedRegion);
  
  const getStadiumStat = (stadiumId: number) => 
    stadiumStats.find(ss => ss.stadiumId === stadiumId);
  
  const getStadiumMatches = (stadiumId: number) =>
    matches.filter(m => m.stadiumId === stadiumId).length;
  
  const getRegion = (regionId: number) => 
    regions.find(r => r.id === regionId);
  
  const handleAddStadium = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    addStadium({
      name: formData.get('name') as string,
      location: formData.get('location') as string,
      capacity: Number(formData.get('capacity')),
      regionId: Number(formData.get('regionId')),
      sportId: 1
    });
    
    setIsAddDialogOpen(false);
    e.currentTarget.reset();
  };
  
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this stadium?')) {
      deleteStadium(id);
    }
  };
  
  const handleEdit = (id: number) => {
    setEditingStadium(id);
    setIsAddDialogOpen(true);
  };
  
  const handleUpdateStadium = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (editingStadium !== null) {
      updateStadium(editingStadium, {
        name: formData.get('name') as string,
        location: formData.get('location') as string,
        capacity: Number(formData.get('capacity')),
        regionId: Number(formData.get('regionId'))
      });
    }
    
    setIsAddDialogOpen(false);
    e.currentTarget.reset();
    setEditingStadium(null);
  };
  
  const editStadium = stadiums.find(s => s.id === editingStadium);
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <MapPin className="h-10 w-10 text-primary" />
          <h2>Stadium Information</h2>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-secondary border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]">
              <Plus className="h-4 w-4 mr-2" />
              Add Stadium
            </Button>
          </DialogTrigger>
          <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <DialogHeader>
              <DialogTitle>Add New Stadium</DialogTitle>
            </DialogHeader>
            <form onSubmit={editingStadium !== null ? handleUpdateStadium : handleAddStadium} className="space-y-4">
              <div>
                <Label htmlFor="name">Stadium Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  required 
                  className="border-2 border-black"
                  placeholder="e.g. Jamsil Baseball Stadium"
                  defaultValue={editStadium?.name}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  name="location" 
                  required 
                  className="border-2 border-black"
                  placeholder="e.g. Songpa-gu, Seoul"
                  defaultValue={editStadium?.location}
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input 
                  id="capacity" 
                  name="capacity" 
                  type="number" 
                  required 
                  className="border-2 border-black"
                  placeholder="25000"
                  defaultValue={editStadium?.capacity?.toString()}
                />
              </div>
              <div>
                <Label htmlFor="regionId">Region</Label>
                <Select name="regionId" required>
                  <SelectTrigger className="border-2 border-black">
                    <SelectValue placeholder="Select Region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.filter(r => r.id !== 0).map(region => (
                      <SelectItem key={region.id} value={region.id.toString()}>
                        {region.name}
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
      
      {/* Region Filter */}
      <div className="bg-white p-4 border-4 border-black rounded-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <Label className="mb-3 block">Region Filter</Label>
        <div className="flex flex-wrap gap-2">
          {regions.map(region => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              className={`
                px-4 py-2 border-2 border-black rounded-sm
                ${selectedRegion === region.id 
                  ? 'bg-accent shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' 
                  : 'bg-white hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                }
              `}
            >
              {region.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Stadiums Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStadiums.map(stadium => {
          const stat = getStadiumStat(stadium.id);
          const matchCount = getStadiumMatches(stadium.id);
          const region = getRegion(stadium.regionId);
          
          return (
            <div 
              key={stadium.id}
              className="bg-white border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            >
              <div className="bg-primary text-white p-4 border-b-4 border-black">
                <h3 className="font-black">{stadium.name}</h3>
                <p className="text-sm opacity-90">{region?.name}</p>
              </div>
              
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-black text-sm mb-1">Location</div>
                    <div className="text-sm">{stadium.location}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Users className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-black text-sm mb-1">Capacity</div>
                    <div className="text-sm">{stadium.capacity.toLocaleString()} seats</div>
                  </div>
                </div>
                
                {stat && (
                  <>
                    <div className="pt-3 border-t-2 border-black">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-accent/20 border-2 border-black rounded-sm">
                          <div className="text-xs font-black mb-1">Matches</div>
                          <div>{stat.totalMatches}</div>
                        </div>
                        <div className="p-2 bg-accent/20 border-2 border-black rounded-sm">
                          <div className="text-xs font-black mb-1">Max Attend.</div>
                          <div className="text-sm">{stat.maxAttendance.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-2 bg-secondary/20 border-2 border-black rounded-sm">
                      <div className="text-xs font-black mb-1">Avg. Attendance</div>
                      <div>{stat.avgAttendance.toLocaleString()}</div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="p-3 border-t-4 border-black flex gap-2">
                <Link
                  to={`/stadiums/${stadium.id}`}
                  className="flex-1 px-3 py-2 bg-primary text-white text-center border-2 border-black rounded-sm hover:bg-primary/90"
                >
                  View Details
                </Link>
                <Dialog open={editingStadium === stadium.id} onOpenChange={(open) => !open && setEditingStadium(null)}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setEditingStadium(stadium.id)}
                      className="px-3 py-2 bg-accent border-2 border-black rounded-sm hover:bg-accent/90"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    {editStadium && (
                      <>
                        <DialogHeader>
                          <DialogTitle>Edit Stadium</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdateStadium} className="space-y-4">
                          <div>
                            <Label htmlFor="edit-name">Stadium Name</Label>
                            <Input 
                              id="edit-name" 
                              name="name" 
                              required 
                              className="border-2 border-black"
                              defaultValue={editStadium.name}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-location">Location</Label>
                            <Input 
                              id="edit-location" 
                              name="location" 
                              required 
                              className="border-2 border-black"
                              defaultValue={editStadium.location}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-capacity">Capacity</Label>
                            <Input 
                              id="edit-capacity" 
                              name="capacity" 
                              type="number" 
                              required 
                              className="border-2 border-black"
                              defaultValue={editStadium.capacity}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-regionId">Region</Label>
                            <Select name="regionId" required defaultValue={editStadium.regionId.toString()}>
                              <SelectTrigger className="border-2 border-black">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {regions.filter(r => r.id !== 0).map(region => (
                                  <SelectItem key={region.id} value={region.id.toString()}>
                                    {region.name}
                                  </SelectItem>
                                ))}
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
                    )}
                  </DialogContent>
                </Dialog>
                <button
                  onClick={() => handleDelete(stadium.id)}
                  className="px-3 py-2 bg-destructive text-white border-2 border-black rounded-sm hover:bg-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredStadiums.length === 0 && (
        <div className="text-center py-12 bg-white border-4 border-black rounded-sm shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xl">No stadiums found in this region.</p>
        </div>
      )}
    </div>
  );
}