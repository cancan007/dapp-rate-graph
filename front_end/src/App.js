
import './App.css';
import { DAppProvider, ChainId } from '@usedapp/core'
import { Container } from "@material-ui/core"
import { Header } from './components/Header'
import { Main } from './components/Main'

function App() {
  return (
    <DAppProvider config={{
      supportedChains: [ChainId.Kovan],
      notifications: {
        expirationPeriod: 1000,
        checkInterval: 1000
      },
      multicallVersion: 2  // After adding this, I could solve RetryOnEmptyError of MetaMask!
    }}>
      <Header />
      <div className="App-header">
        <Container maxWidth="md">
          <Main />
        </Container>
      </div>
    </DAppProvider>
  );
}

export default App;
