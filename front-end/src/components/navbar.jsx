import { Menu, Button, Modal, Form, Input, message } from "antd";
import { BookOutlined, LoginOutlined, CrownOutlined, UnorderedListOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import logo from "../img/logo.png";
import "./navbar.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../auth/useAuth.js"; 
import { loginApi } from "../services/authService.js"; // your API call function

function Navbar() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { currentUser, login, logout } = useAuth();

  const handleOk = async () => {
    try {
      const { user: username, password } = await form.validateFields();
      const token = await loginApi(username, password); 
      login(token); 
      setIsModalVisible(false);
    } catch (err) {
      message.error(err.message || "Connexion échouée");
    }
  };

  const menuItems = [{ key: "classement", icon: <CrownOutlined />, label: <Link to="/classement">Classement</Link>}];

  if (currentUser) {
    menuItems.push({
      key: "reservations",
      icon: <BookOutlined />,
      label: <Link to="/reserver">Réserver</Link>,
    });
  }

  if (currentUser && currentUser.isAdmin) {
    menuItems.push(
      {
        key: "parties",
        icon: <UnorderedListOutlined />,
        label: <Link to="/parties">Parties</Link>,
      },
      {
        key: "utilisateurs",
        icon: <UserOutlined />,
        label: <Link to="/utilisateurs">Utilisateurs</Link>,
      }
    );
  }

  return (
    <div className="navbar-container">
      <div className="logo">
        <Link to="/"><img src={logo} alt="logo" /></Link>
      </div>

      <Menu mode="horizontal" selectable={false} className="center-menu" items={menuItems} />

      {currentUser ? (
        <Link to="/">
          <Button type="primary" icon={<LogoutOutlined />} onClick={logout}>
            Déconnexion
          </Button>
        </Link>
      ) : (
        <Button type="primary" icon={<LoginOutlined />} onClick={() => setIsModalVisible(true)}>
          Se connecter
        </Button>
      )}

      <Modal
        title="Connexion"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Se connecter"
        cancelText="Annuler"
        maskClosable={false}
      >
        <Form form={form} layout="vertical" name="loginForm">
          <Form.Item label="Username" name="user" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Mot de passe" name="password" rules={[{ required: true }]}>
            <Input.Password placeholder="Mot de passe" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Navbar;
