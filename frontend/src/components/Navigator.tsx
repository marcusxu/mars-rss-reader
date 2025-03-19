import { Link } from 'react-router';
import logo from '../../../assets/logo.png';

export const Navigator = () => (
  <nav>
    <img src={logo} alt="Mars RSS Reader Logo" style={{ width: '100px' }} />
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
