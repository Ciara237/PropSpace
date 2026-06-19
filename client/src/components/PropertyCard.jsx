import {
  Badge,
  Box,
  Card,
  Heading,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

function getAuthorName(author) {
  if (author && typeof author === 'object' && author.username) {
    return author.username;
  }

  return 'Unknown';
}

export default function PropertyCard({ property }) {
  const imageUrl = property.imageUrls?.[0];

  return (
    <Card.Root overflow="hidden" height="100%">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={property.title}
          height="200px"
          width="100%"
          objectFit="cover"
        />
      ) : (
        <Box
          height="200px"
          bg="gray.100"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="gray.500">No image</Text>
        </Box>
      )}

      <Card.Body>
        <VStack align="stretch" gap={2}>
          <Heading size="md" lineClamp={1}>
            {property.title}
          </Heading>

          <Text color="gray.600" fontSize="sm">
            {property.city}, {property.country}
          </Text>

          <Text fontWeight="bold" fontSize="lg" colorPalette="blue">
            {formatPrice(property.price)}
          </Text>

          {property.type && (
            <Badge colorPalette="gray" width="fit-content">
              {property.type}
            </Badge>
          )}

          <Text fontSize="sm" color="gray.500">
            Listed by {getAuthorName(property.author)}
          </Text>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
