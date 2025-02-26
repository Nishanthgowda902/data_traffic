
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './DataContext';
import { Dashboard } from './components/Dashboard';
import { DataInput } from './components/DataInput';

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/input" element={<DataInput />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;