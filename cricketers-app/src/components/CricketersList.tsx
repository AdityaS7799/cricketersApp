import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button, FormControl, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import getPlayers, {TMayBe, TPlayer} from '../data/get-players';

const PAGE_SIZE = 10;

type TSortKey = keyof TPlayer;
type TSortOrder = 'asc' | 'desc';
type TFilterType = TMayBe<'batsman' | 'bowler' | 'allRounder' | 'wicketKeeper'>;

const CricketersList: React.FC = () => {
  const [players, setPlayers] = useState<TPlayer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortKey, setSortKey] = useState<TSortKey>();
  const [sortOrder, setSortOrder] = useState<TSortOrder>('asc');
  const [filterType, setFilterType] = useState<TFilterType>();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      const data = await getPlayers();
      setPlayers(data);
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    const filteredPlayers = applyFiltersAndSearch(players);
    const sortedPlayers = applySorting(filteredPlayers);
    const totalPlayers = sortedPlayers.length;

    setTotalPages(Math.ceil(totalPlayers / PAGE_SIZE));
    setCurrentPage(1);
  }, [players, sortKey, sortOrder, filterType, searchQuery]);

  const applyFiltersAndSearch = (data: TPlayer[]): TPlayer[] => {
    let filteredData = data;

    if (filterType) {
      filteredData = filteredData.filter((player) => player.type === filterType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredData = filteredData.filter(
        (player) =>
          player.name?.toLowerCase().includes(query) ||
          player.description?.toLowerCase().includes(query)
      );
    }

    return filteredData;
  };

  const calculateAge = (dob?: TMayBe<number>): number => {
    if (!dob) return 0;

    const birthDate = new Date(dob);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();

    return age;
  };

  const applySorting = (data: TPlayer[]): TPlayer[] => {
    if (!sortKey) return data;
    
    const sortedData = [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
  
      if (sortOrder === 'asc') {
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return aValue - bValue;
        }
      } else {
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return bValue.localeCompare(aValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return bValue - aValue;
        }
      }
  
      return 0;
    });
  
    return sortedData;
  };
  

  const handleSort = (key: TSortKey) => {
    if (key === sortKey) {
      setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleFilter = (type: TFilterType) => {
    setFilterType(type);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const filteredPlayers = useMemo(() => {
    const filteredData = applyFiltersAndSearch(players);
    const sortedData = applySorting(filteredData);
    return sortedData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  }, [players, sortKey, sortOrder, filterType, searchQuery, currentPage]);

  return (
    <div className="container mt-3">
      <h1 className='text-center'>The Indian Cricket Team   </h1>
      <div className="mb-3 d-flex justify-content-between">
        <h6>Filter By Type:</h6>
        <Button variant="btn btn-mini btn-primary" onClick={() => handleFilter(undefined)}>
          All
        </Button>
        <Button variant="btn btn-mini btn-primary" onClick={() => handleFilter('batsman')}>
          Batsman
        </Button>
        <Button variant="btn btn-mini btn-primary" onClick={() => handleFilter('bowler')}>
          Bowler
        </Button>
        <Button variant="btn btn-mini btn-primary" onClick={() => handleFilter('allRounder')}>
          All-Rounder
        </Button>
        <Button variant="btn btn-mini btn-primary" onClick={() => handleFilter('wicketKeeper')}>
          Wicket Keeper
        </Button>
      </div>
      <div className="mb-3" >
        <FormControl
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('type')}>Type</th>
            <th onClick={() => handleSort('points')}>Points</th>
            <th onClick={() => handleSort('rank')}>Rank</th>
            <th onClick={() => handleSort('dob')}>Age</th>
          </tr>
        </thead>
        <tbody>
          {filteredPlayers.map((player) => (
            <tr key={player.id}>
              <td>
                <Link to={`/players/${player.id}`}>{player.name}</Link>
              </td>
              <td>{player.type}</td>
              <td>{player.points}</td>
              <td>{player.rank}</td>
              <td>{calculateAge(player.dob)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? 'primary' : 'outline-primary'}
            onClick={() => handlePageChange(page)}
            className="mx-1"
          >
            {page}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CricketersList;