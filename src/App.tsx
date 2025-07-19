import { useEffect } from 'react';
import { useAppStore } from './stores/appStore';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { LoadingSpinner } from './components/LoadingSpinner';
import './App.css';

function App() {
  const { initializeApp, isLoading } = useAppStore();

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}

export default App;