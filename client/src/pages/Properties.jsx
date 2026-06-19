import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Center,
  Container,
  Flex,
  Heading,
  Loader,
  SimpleGrid,
  Text,
} from '@chakra-ui/react';
import axiosInstance from '../api/axiosInstance';
import FilterSidebar from '../components/FilterSidebar';
import PropertyCard from '../components/PropertyCard';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProperties = useCallback(async (filters = {}) => {
    setLoading(true);
    setError('');

    try {
      const params = {};

      if (filters.city?.trim()) {
        params.city = filters.city.trim();
      }
      if (filters.minPrice !== '' && filters.minPrice != null) {
        params.minPrice = filters.minPrice;
      }
      if (filters.maxPrice !== '' && filters.maxPrice != null) {
        params.maxPrice = filters.maxPrice;
      }

      const { data } = await axiosInstance.get('/api/properties', { params });
      setProperties(data);
    } catch (err) {
      setProperties([]);
      setError(err.response?.data?.message || 'Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleSearch = (filters) => {
    fetchProperties(filters);
  };

  return (
    <Container maxW="7xl" py={8}>
      <Heading mb={6}>Property Listings</Heading>

      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap={6}
        align={{ base: 'stretch', md: 'flex-start' }}
      >
        <FilterSidebar onSearch={handleSearch} />

        <Box flex={1}>
          {loading && (
            <Center py={16}>
              <Loader size="xl" />
            </Center>
          )}

          {!loading && error && (
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Description>{error}</Alert.Description>
            </Alert.Root>
          )}

          {!loading && !error && properties.length === 0 && (
            <Center py={16}>
              <Text color="gray.500" fontSize="lg">
                No properties found
              </Text>
            </Center>
          )}

          {!loading && !error && properties.length > 0 && (
            <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} gap={6}>
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Flex>
    </Container>
  );
}
