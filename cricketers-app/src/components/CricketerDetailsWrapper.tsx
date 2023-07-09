import React from 'react';
import { useParams } from 'react-router-dom';
import CricketerDetails from './CricketerDetail';
import { TPlayer } from '../data/get-players';

const CricketerDetailsWrapper: React.FC<{ players: TPlayer[] }> = ({ players }) => {
    const { id } = useParams<{ id: string }>();
  
    const player = players.find((p) => p.id === id);
  
    if (player) {
      return <CricketerDetails player={player} />;
    } else {
      return <div>Player not found</div>;
    }
  };

  export default CricketerDetailsWrapper;