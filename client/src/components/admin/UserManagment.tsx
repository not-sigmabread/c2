import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@chakra-ui/react';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../utils/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filter, setFilter] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user: currentUser } = useAuth();
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching users',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
      toast({
        title: 'Role updated',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error updating role',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleBanUser = async (userId: string, reason: string, duration: number) => {
    try {
      await api.post(`/admin/users/${userId}/ban`, { reason, duration });
      fetchUsers();
      onClose();
      toast({
        title: 'User banned',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Error banning user',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(filter.toLowerCase()) ||
    user.role.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Box>
      <Input
        placeholder="Filter users..."
        mb={4}
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Username</Th>
            <Th>Role</Th>
            <Th>Status</Th>
            <Th>Last Login</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredUsers.map((user) => (
            <Tr key={user._id}>
              <Td>{user.username}</Td>
              <Td>
                {currentUser.role === 'Owner' ? (
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  >
                    <option value="User">User</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Admin">Admin</option>
                    {currentUser.username === 'sigmabread' && (
                      <option value="Owner">Owner</option>
                    )}
                  </Select>
                ) : (
                  user.role
                )}
              </Td>
              <Td>{user.status}</Td>
              <Td>{new Date(user.lastLogin).toLocaleString()}</Td>
              <Td>
                <Button
                  colorScheme="red"
                  size="sm"
                  onClick={() => {
                    setSelectedUser(user);
                    onOpen();
                  }}
                  isDisabled={user.role === 'Owner'}
                >
                  Ban
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ban User</ModalHeader>
          <ModalBody>
            {/* Ban user form content */}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red">
              Ban User
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserManagement;
