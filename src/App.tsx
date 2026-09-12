
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import caseLogo from '/caselogo.svg';

import Home from './pages/Home';
import About from './pages/About';
import Works from './pages/works';
import WorkPage from './pages/works/WorkPage';
import MarkdownSandbox from './pages/works/MarkdownSandbox';
import SocialStyleTest from './pages/works/SocialStyleTest';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
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
          {/* その場で触れるものは、一覧と同じ Works の下に置く。パスは data/works.ts の path と対応 */}
          <Route
            path="/works/markdown-sandbox"
            element={
              <WorkPage id="markdown-sandbox">
                <MarkdownSandbox />
              </WorkPage>
            }
          />
          <Route
            path="/works/social-style-test"
            element={
              <WorkPage id="social-style-test">
                <SocialStyleTest />
              </WorkPage>
            }
          />
          {/* 旧 /tools。単独ページとしては廃止したが、既に配られたリンクを壊さないため残す */}
          <Route path="/tools/*" element={<Navigate to="/works" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
