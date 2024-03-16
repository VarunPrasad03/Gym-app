import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';

import { exerciseOptions, fetchData } from '../utils/fetchData';
import HorizontalScrollbar from './HorizontalScrollbar';

const SearchExercises = ({ setExercises, bodyPart, setBodyPart }) => {
  const [search, setSearch] = useState('');
  const [bodyParts, setBodyParts] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    const fetchBodyPartsData = async () => {
      try {
        setLoading(true); // Set loading state to true
        const bodyPartsData = await fetchData('https://exercisedb.p.rapidapi.com/exercises/bodyPartList', exerciseOptions);

        if (Array.isArray(bodyPartsData)) {
          // Extracting body parts from bodyPartsData object
          const parts = bodyPartsData.map(item => item.bodyPart);
          setBodyParts(['all', ...parts]);
        } else {
          console.error('Invalid bodyPartsData:', bodyPartsData);
        }
      } catch (error) {
        console.error('Error fetching bodyPartsData:', error);
      } finally {
        setLoading(false); // Set loading state to false regardless of success or failure
      }
    };

    fetchBodyPartsData();
  }, []);

  const handleSearch = async () => {
    if (search) {
      try {
        setLoading(true); // Set loading state to true
        const exercisesData = await fetchData('https://exercisedb.p.rapidapi.com/exercises', exerciseOptions);

        const searchedExercises = exercisesData.filter(
          (item) => item.name.toLowerCase().includes(search)
                 || item.target.toLowerCase().includes(search)
                 || item.equipment.toLowerCase().includes(search)
                 || item.bodyPart.toLowerCase().includes(search),
        );

        window.scrollTo({ top: 1800, left: 100, behavior: 'smooth' });

        setSearch('');
        setExercises(searchedExercises);
      } finally {
        setLoading(false); // Set loading state to false after handling search
      }
    }
  };

  return (
    <Stack alignItems="center" mt="37px" justifyContent="center" p="20px">
      <Typography fontWeight={700} sx={{ fontSize: { lg: '44px', xs: '30px' } }} mb="49px" textAlign="center">
        Awesome Exercises You <br /> Should Know
      </Typography>
      <Box position="relative" mb="72px">
        <TextField
          height="76px"
          sx={{ input: { fontWeight: '700', border: 'none', borderRadius: '4px' }, width: { lg: '1170px', xs: '350px' }, backgroundColor: '#fff', borderRadius: '40px' }}
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          placeholder="Search Exercises"
          type="text"
        />
        <Button className="search-btn" sx={{ bgcolor: '#FF2625', color: '#fff', textTransform: 'none', width: { lg: '173px', xs: '80px' }, height: '56px', position: 'absolute', right: '0px', fontSize: { lg: '20px', xs: '14px' } }} onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'} {/* Display "Searching..." text while loading */}
        </Button>
      </Box>
      <Box sx={{ position: 'relative', width: '100%', p: '20px' }}>
        <HorizontalScrollbar data={bodyParts} setBodyPart={setBodyPart} bodyPart={bodyPart} />
      </Box>
    </Stack>
  );
};

export default SearchExercises;
