import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import HistoryPage from './pages/HistoryPage';
import AnalysisDetailPage from './pages/AnalysisDetailPage';
import RecruitmentCreatePage from './pages/RecruitmentCreatePage';
import RecruitmentListPage from './pages/RecruitmentListPage';
import RecruitmentDetailPage from './pages/RecruitmentDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/analysis/:id" element={<AnalysisDetailPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/recruitment" element={<RecruitmentListPage />} />
          <Route path="/recruitment/:id" element={<RecruitmentDetailPage />} />
          <Route path="/recruitment/create/:analysisId" element={<RecruitmentCreatePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
