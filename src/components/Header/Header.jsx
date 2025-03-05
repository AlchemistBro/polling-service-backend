import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext/AuthContext';

const HeaderContainer = styled.header`
  height: 60px;
  display: flex;
  padding: 0 2rem;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  background: #fafafa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 0 1rem; 
  }

  @media (max-width: 480px) {
    height: auto; 
    flex-direction: column; 
    padding: 1rem; 
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column; 
    gap: 0.5rem;
    width: 100%; 
  }
`;

const NavLink = styled(Link)`
  text-decoration: none;
  color: #333;
  font-weight: bold;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3498db;
    color: white;
  }

  @media (max-width: 480px) {
    width: 100%; 
    text-align: center; 
    padding: 0.5rem;
  }
`;

export default function Header() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <HeaderContainer>
            <Nav>
                <NavLink to="/">Главная</NavLink>
                {user && <NavLink to="/my-account">Мой аккаунт</NavLink>}
                {user && <NavLink to="/my-polls">Мои опросы</NavLink>}
            </Nav>
            <Nav>
                {user ? (
                    <NavLink onClick={handleLogout}>Выйти</NavLink>
                ) : (
                    <>
                        <NavLink to="/login">Войти</NavLink>
                        <NavLink to="/register">Регистрация</NavLink>
                    </>
                )}
            </Nav>
        </HeaderContainer>
    );
}