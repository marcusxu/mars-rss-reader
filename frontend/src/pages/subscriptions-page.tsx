import { useEffect, useState } from 'react';
import {
  getSubscriptions,
  addSubscription,
  deleteSubscription,
} from '../services/subscription-service';
import {
  Button,
  ButtonGroup,
  Chip,
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Subscription {
  id: string;
  url: string;
  name: string;
  description?: string;
  category?: string;
}

export function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [newSubUrl, setNewSubUrl] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubDescription, setNewSubDescription] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('');
  const [inputErrorState, setInputErrorState] = useState(false);

  const fetchSubscriptions = async () => {
    const response = await getSubscriptions();
    setSubscriptions(response);
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
      setInputErrorState(false);
      fetchSubscriptions();
    } else {
      setInputErrorState(true);
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
  const handleModifySub = async (subscriptionId: string) => {
    console.log('Modify subscription with id:', subscriptionId);
  };

  return (
    <Container maxWidth="lg">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Url</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Category</TableCell>
              <TableCell align="center">Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <TextField
                  fullWidth
                  size="small"
                  label="Name"
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  error={inputErrorState}
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
                  error={inputErrorState}
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
                  error={inputErrorState}
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
                  error={inputErrorState}
                ></TextField>
              </TableCell>
              <TableCell>
                <Button onClick={handleAddSub}>Add</Button>
              </TableCell>
            </TableRow>
            {subscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>
                  {' '}
                  <TextField label={subscription.name} disabled={true}>
                    {' '}
                  </TextField>
                </TableCell>
                <TableCell>
                  <Link href={subscription.url} target="_blank">
                    {subscription.url}
                  </Link>
                </TableCell>
                <TableCell>{subscription.description}</TableCell>
                <TableCell>
                  <Chip label={subscription.category} clickable={true}></Chip>
                </TableCell>
                <TableCell>
                  <ButtonGroup size="small">
                    <Button onClick={() => handleModifySub(subscription.id)}>
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
