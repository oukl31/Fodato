import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './components/HomePage';
import { SchedulePage } from './components/SchedulePage';
import { MatchDetailPage } from './components/MatchDetailPage';
import { StadiumsPage } from './components/StadiumsPage';
import { StadiumDetailPage } from './components/StadiumDetailPage';
import { BroadcastsPage } from './components/BroadcastsPage';
import { StatsPage } from './components/StatsPage';
import { RegionsPage } from './components/RegionsPage';
import { TeamsPage } from './components/TeamsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/match/:id" element={<MatchDetailPage />} />
          <Route path="/stadiums" element={<StadiumsPage />} />
          <Route path="/stadiums/:id" element={<StadiumDetailPage />} />
          <Route path="/broadcasts" element={<BroadcastsPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/regions" element={<RegionsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}