import { useEffect, useState } from 'react';
import {
  getSubscriptions,
  addSubscription,
  deleteSubscription,
} from '../services/subscription-service';

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
    <div>
      <h1>Subscriptions</h1>
      <table>
        <thead>
          <tr>
            <th>🔒ID</th>
            <th>Name</th>
            <th>Url</th>
            <th>Description</th>
            <th>Category</th>
            <th>Operation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>-</td>
            <td>
              <input
                type="text"
                value={newSubName}
                onChange={(e) => setNewSubName(e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                value={newSubUrl}
                onChange={(e) => setNewSubUrl(e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                value={newSubDescription}
                onChange={(e) => setNewSubDescription(e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
              />
            </td>
            <button onClick={handleAddSub}>Add</button>
            {newSubErrorMsg && (
              <span style={{ color: 'red' }}>{newSubErrorMsg}</span>
            )}
          </tr>
          {subscriptions.map((subscription) => (
            <tr key={subscription.id}>
              <td>{subscription.id}</td>
              <td>{subscription.name}</td>
              <td>
                <a href={subscription.url} target="_blank">
                  {subscription.url}
                </a>
              </td>
              <td>{subscription.description}</td>
              <td>{subscription.category}</td>
              <td>
                <button disabled onClick={() => handleModifySub()}>
                  Modify
                </button>
                <button onClick={() => handleDeleteSub(subscription.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
