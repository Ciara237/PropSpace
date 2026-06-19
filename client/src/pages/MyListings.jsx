import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Center,
  Dialog,
  Flex,
  Heading,
  HStack,
  Loader,
  Text,
  VStack,
} from '@chakra-ui/react';
import axiosInstance from '../api/axiosInstance';
import PropertyForm from '../components/PropertyForm';

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function MyListings() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await axiosInstance.get('/api/properties/mine');
      setProperties(data);
    } catch (err) {
      setProperties([]);
      setError(err.response?.data?.message || 'Failed to load your listings. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleCreate = () => {
    setEditingProperty(null);
    setFormOpen(true);
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingProperty(null);
  };

  const handleFormSuccess = () => {
    handleCloseForm();
    fetchListings();
  };

  const handleDelete = async (id) => {
    setDeletingId(id);

    try {
      await axiosInstance.delete(`/api/properties/${id}`);
      setProperties((prev) => prev.filter((property) => property._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete listing. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">My Listings</Heading>
        <Button colorPalette="blue" onClick={handleCreate}>
          Add listing
        </Button>
      </Flex>

      {loading && (
        <Center py={16}>
          <Loader size="xl" />
        </Center>
      )}

      {!loading && error && (
        <Alert.Root status="error" mb={4}>
          <Alert.Indicator />
          <Alert.Description>{error}</Alert.Description>
        </Alert.Root>
      )}

      {!loading && !error && properties.length === 0 && (
        <Center py={16}>
          <Text color="gray.500" fontSize="lg">
            You have no listings yet
          </Text>
        </Center>
      )}

      {!loading && properties.length > 0 && (
        <VStack gap={4} align="stretch">
          {properties.map((property) => (
            <Card.Root key={property._id}>
              <Card.Body>
                <Flex
                  direction={{ base: 'column', sm: 'row' }}
                  justify="space-between"
                  align={{ base: 'stretch', sm: 'center' }}
                  gap={4}
                >
                  <Box>
                    <Heading size="md" mb={1}>
                      {property.title}
                    </Heading>
                    <Text color="gray.600" fontSize="sm" mb={2}>
                      {property.city}, {property.country}
                    </Text>
                    <HStack gap={2}>
                      <Text fontWeight="bold">{formatPrice(property.price)}</Text>
                      {property.type && <Badge colorPalette="gray">{property.type}</Badge>}
                    </HStack>
                  </Box>

                  <HStack gap={2}>
                    <Button variant="outline" onClick={() => handleEdit(property)}>
                      Edit
                    </Button>
                    <Button
                      colorPalette="red"
                      variant="outline"
                      loading={deletingId === property._id}
                      onClick={() => handleDelete(property._id)}
                    >
                      Delete
                    </Button>
                  </HStack>
                </Flex>
              </Card.Body>
            </Card.Root>
          ))}
        </VStack>
      )}

      <Dialog.Root open={formOpen} onOpenChange={(e) => !e.open && handleCloseForm()}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW="lg">
            <Dialog.Header>
              <Dialog.Title>
                {editingProperty ? 'Edit Property' : 'Create Property'}
              </Dialog.Title>
              <Dialog.CloseTrigger />
            </Dialog.Header>
            <Dialog.Body>
              <PropertyForm
                property={editingProperty}
                onSuccess={handleFormSuccess}
                onCancel={handleCloseForm}
              />
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
}
