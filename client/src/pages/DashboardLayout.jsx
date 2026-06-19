import { Link as RouterLink, Outlet } from 'react-router-dom';
import { Box, Button, Container, Flex, Heading, Link } from '@chakra-ui/react';
import useAuth from '../hooks/useAuth';

export default function DashboardLayout() {
  const { logout } = useAuth();

  return (
    <Box>
      <Container maxW="7xl" py={6}>
        <Flex justify="space-between" align="center" mb={8} wrap="wrap" gap={4}>
          <Heading size="lg">Dashboard</Heading>
          <Flex gap={4} align="center" wrap="wrap">
            <Link asChild colorPalette="blue">
              <RouterLink to="/dashboard/listings">My Listings</RouterLink>
            </Link>
            <Link asChild colorPalette="blue">
              <RouterLink to="/dashboard/profile">Profile</RouterLink>
            </Link>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </Flex>
        </Flex>
        <Outlet />
      </Container>
    </Box>
  );
}
