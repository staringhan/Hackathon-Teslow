import { Menu,Button } from 'antd';
import { BookOutlined, LoginOutlined, CrownOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import logo from '../img/logo.png';
import './navbar.css';

function Navbar(){
  return (
    <div className="navbar-container">

      <div className="logo">
        <img src={logo} alt="logo" />
      </div>


      <Menu mode="horizontal" selectable={false} className="center-menu">
        <Menu.Item className="menu-item" key="reservations" icon={<BookOutlined />}>
          Réserver / Réservations
        </Menu.Item>
        <Menu.Item className="menu-item" key="classement" icon={<CrownOutlined />}>
          Classement
        </Menu.Item>
        <Menu.Item className="menu-item" key="parties" icon={<UnorderedListOutlined />}>
          Parties
        </Menu.Item>
        <Menu.Item className="menu-item" key="utilisateurs" icon={<UserOutlined />}>
          Utilisateurs
        </Menu.Item>
      </Menu>

      {/* Bouton "Connecter" à droite */}
        <Button type="primary" className="connect-button" icon={<LoginOutlined />}>
            Se connecter
        </Button>
    </div>
  );
};

export default Navbar;
