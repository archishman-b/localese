import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Learn from './pages/Learn.jsx';
import Lesson from './pages/Lesson.jsx';
import './styles/tokens.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn/:langId" element={<Learn />} />
        <Route path="/lesson/:langId/:lessonId" element={<Lesson />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
