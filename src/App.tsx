import { MainLayout } from '@/components/layout/MainLayout';
import { WorkspaceView } from '@/components/views/Workspace';
import { DataView } from '@/components/views/Data';
import { HomeView } from '@/components/views/Home';
import { ConnectView } from '@/components/views/Connect';
import { SplashView } from '@/components/views/Splash';
import { NfcConnectView } from '@/components/views/NfcConnect';
import { NfcConnectedView } from '@/components/views/NfcConnected';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { AnimatePresence } from 'framer-motion';

function App() {
  const activeView = useWorkspaceStore((state) => state.activeView);

  const renderView = () => {
    switch (activeView) {
      case 'home':      return <HomeView key="home" />;
      case 'dashboard': return <WorkspaceView key="workspace" />;
      case 'connect':   return <ConnectView key="connect" />;
      case 'data':      return <DataView key="data" />;
      case 'splash':    return <SplashView key="splash" />;
      case 'nfc-connect': return <NfcConnectView key="nfc-connect" />;
      case 'nfc-connected': return <NfcConnectedView key="nfc-connected" />;
      default:          return <HomeView key="home" />;
    }
  };

  return (
    <MainLayout>
      <AnimatePresence mode="wait">
        {renderView()}
      </AnimatePresence>
    </MainLayout>
  );
}

export default App;
