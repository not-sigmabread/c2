import { useState } from 'react';
import { 
  Box, 
  Tabs, 
  TabList, 
  TabPanels, 
  Tab, 
  TabPanel,
  useToast
} from '@chakra-ui/react';
import UserManagement from '../components/admin/UserManagement';
import ChannelManagement from '../components/admin/ChannelManagement';
import ModerationLogs from '../components/admin/ModerationLogs';
import SystemSettings from '../components/admin/SystemSettings';
import { useAuth } from '../hooks/useAuth';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useAuth();
  const toast = useToast();

  const isOwner = user?.role === 'Owner';

  return (
    <Box p={4}>
      <Tabs index={activeTab} onChange={setActiveTab}>
        <TabList>
          <Tab>User Management</Tab>
          <Tab>Channel Management</Tab>
          <Tab>Moderation Logs</Tab>
          {isOwner && <Tab>System Settings</Tab>}
        </TabList>

        <TabPanels>
          <TabPanel>
            <UserManagement />
          </TabPanel>
          <TabPanel>
            <ChannelManagement />
          </TabPanel>
          <TabPanel>
            <ModerationLogs />
          </TabPanel>
          {isOwner && (
            <TabPanel>
              <SystemSettings />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AdminPanel;
