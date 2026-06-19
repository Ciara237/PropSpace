import { useState } from 'react';
import {
  Button,
  Card,
  Field,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react';

export default function FilterSidebar({ onSearch }) {
  const [city, setCity] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ city, minPrice, maxPrice });
  };

  return (
    <Card.Root width={{ base: '100%', md: '280px' }} flexShrink={0}>
      <Card.Body>
        <form onSubmit={handleSubmit}>
          <VStack gap={4} align="stretch">
            <Heading size="sm">Filters</Heading>

            <Field.Root>
              <Field.Label>City</Field.Label>
              <Input
                type="text"
                placeholder="e.g. London"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Min price</Field.Label>
              <Input
                type="number"
                min="0"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Max price</Field.Label>
              <Input
                type="number"
                min="0"
                placeholder="Any"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </Field.Root>

            <Button type="submit" colorPalette="blue" width="100%">
              Search
            </Button>
          </VStack>
        </form>
      </Card.Body>
    </Card.Root>
  );
}
