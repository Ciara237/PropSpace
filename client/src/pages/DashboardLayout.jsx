import { Link as RouterLink, Outlet } from 'react-router-dom';
import { Box, Container, Flex, Heading, Link } from '@chakra-ui/react';

export default function DashboardLayout() {
  return (
    <Box>
      <Container maxW="7xl" py={6}>
        <Flex gap={4} mb={8} wrap="wrap">
          <Heading size="lg">Dashboard</Heading>
          <Flex gap={4} align="center" ml={{ md: 'auto' }}>
            <Link asChild colorPalette="blue">
              <RouterLink to="/dashboard/listings">My Listings</RouterLink>
            </Link>
            <Link asChild colorPalette="blue">
              <RouterLink to="/dashboard/profile">Profile</RouterLink>
            </Link>
          </Flex>
        </Flex>
        <Outlet />
      </Container>
    </Box>
  );
}
