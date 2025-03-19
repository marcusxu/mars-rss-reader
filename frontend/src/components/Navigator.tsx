import { Link } from 'react-router';

export const Navigator = () => (
  <nav>
    <ul>
      <li>
        <Link to="/">Homepage</Link>
      </li>
      <li>
        <Link to="/subscriptions">Subscriptions</Link>
      </li>
    </ul>
  </nav>
);
