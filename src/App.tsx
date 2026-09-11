
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import caseLogo from '/caselogo.svg';

import Home from './pages/Home';
import About from './pages/About';
import Works from './pages/Works';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import ToolsIndex from './pages/tools';
import Layout from './components/Layout';
import React from 'react';



interface AppProps {
  mode: 'light' | 'dark';
  setMode: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
}

const App: React.FC<AppProps> = ({ mode, setMode }) => {
  return (
    <BrowserRouter>
      <Layout mode={mode} setMode={setMode}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/works" element={<Works />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tools/*" element={<ToolsIndex />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
