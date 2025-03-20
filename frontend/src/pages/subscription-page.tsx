import { useEffect, useState } from 'react';
import {
  getSubscriptions,
  addSubscription,
  deleteSubscription,
} from '../services/subscription-service';
import {
  Button,
  ButtonGroup,
  Container,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Subscription {
  id: string;
  url: string;
  name: string;
  description?: string;
  category?: string;
}

export function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [newSubUrl, setNewSubUrl] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubDescription, setNewSubDescription] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('');
  const [newSubErrorMsg, setNewSubErrorMsg] = useState('');

  const fetchSubscriptions = async () => {
    const response = await getSubscriptions();
    setSubscriptions(response.data);
  };
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleAddSub = async () => {
    const response = await addSubscription(
      newSubUrl,
      newSubName,
      newSubDescription,
      newSubCategory,
    );
    if (response.status == 201) {
      setNewSubUrl('');
      setNewSubName('');
      setNewSubDescription('');
      setNewSubCategory('');
      setNewSubErrorMsg('');
      fetchSubscriptions();
    } else {
      setNewSubErrorMsg('Failed: ' + response.message);
    }
  };

  const handleDeleteSub = async (id: string) => {
    const isConfirmed = window.confirm('Confirm to delete subscription?' + id);
    if (isConfirmed) {
      await deleteSubscription(id);
      fetchSubscriptions();
    }
  };

  // TODO: Implement handleModifySub
  const handleModifySub = async () => {
    // When click the button, the row become editable, and show save button
    // When click save, call service function to modify
    // After finish, the row become non-editable, and show modify button
    // Refresh the table
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h6">Subscriptions</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Url</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>-</TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  size="small"
                  label="Name"
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                ></TextField>
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  size="small"
                  required
                  label="Url"
                  type="text"
                  value={newSubUrl}
                  onChange={(e) => setNewSubUrl(e.target.value)}
                ></TextField>
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  size="small"
                  label="Description"
                  type="text"
                  value={newSubDescription}
                  onChange={(e) => setNewSubDescription(e.target.value)}
                ></TextField>
              </TableCell>
              <TableCell>
                <TextField
                  fullWidth
                  size="small"
                  label="Category"
                  type="text"
                  value={newSubCategory}
                  onChange={(e) => setNewSubCategory(e.target.value)}
                ></TextField>
              </TableCell>
              <TableCell>
                <Button onClick={handleAddSub}>Add</Button>
                {newSubErrorMsg && (
                  <span style={{ color: 'red' }}>{newSubErrorMsg}</span>
                )}
              </TableCell>
            </TableRow>
            {subscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>{subscription.id}</TableCell>
                <TableCell>{subscription.name}</TableCell>
                <TableCell>
                  <Link href={subscription.url} target="_blank">
                    {subscription.url}
                  </Link>
                </TableCell>
                <TableCell>{subscription.description}</TableCell>
                <TableCell>{subscription.category}</TableCell>
                <TableCell>
                  <ButtonGroup size="small">
                    <Button disabled onClick={() => handleModifySub()}>
                      Modify
                    </Button>
                    <Button
                      onClick={() => handleDeleteSub(subscription.id)}
                      color="error"
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
