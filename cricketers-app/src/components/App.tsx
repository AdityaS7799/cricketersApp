import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import getPlayers, { TPlayer} from '../data/get-players';
import CricketersList from './CricketersList';
import CricketerDetailsWrapper from './CricketerDetailsWrapper';

const App: React.FC = () => {

  const [players, setPlayers] = useState<TPlayer[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const data = await getPlayers();
      setPlayers(data);
    };

    fetchPlayers();
  }, []);

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<CricketersList />} />
      <Route path='/players/:id' element={<CricketerDetailsWrapper players={players} />} />
    </Routes>
    </BrowserRouter>
  );
};

export default App;
