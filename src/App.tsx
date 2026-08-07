// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InitialHome from './components/InitialHome';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InitialHome />} />
      </Routes>
    </Router>
  );
}