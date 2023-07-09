import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import getPlayers, { TPlayer } from '../data/get-players';

const CricketerDetails: React.FC<{ player: TPlayer }> = ({ player }) => {
  const [similarPlayers, setSimilarPlayers] = useState<TPlayer[]>([]);

  useEffect(() => {
    const fetchSimilarPlayers = async () => {
      const data = await getPlayers();
      const filteredData = data.filter((p) => p.type === player.type && p.id !== player.id);
      setSimilarPlayers(filteredData.slice(0, 5));
    };

    fetchSimilarPlayers();
  }, [player]);

  const formattedDOB = player.dob ? new Date(player.dob).toLocaleDateString() : '';

  return (
    <div className='container mt-3'>
      <div className='card'>
        <div className='card-body'>
          <h1 className='card-title'>{player.name}</h1>
          <p className='card-text'>{player.description}</p>
          <p><b>Type:</b> {player.type}</p>
          <p><b>Points:</b> {player.points}</p>
          <p><b>Rank:</b> {player.rank}</p>
          <p><b>Date of Birth:</b> {formattedDOB}</p>
          <h2>Similar Players:</h2>
          <ul>
             {similarPlayers.map((similarPlayer) => (
              <li key={similarPlayer.id}>
                <p><b>Name:</b> {similarPlayer.name}</p>
                <p><b>Points:</b> {similarPlayer.points}</p>
                <p><b>Rank:</b> {similarPlayer.rank}</p>
              </li> 
            ))}
          </ul>
          <Link to='/' className='btn btn-primary'>
            Back to Cricketers
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CricketerDetails;
