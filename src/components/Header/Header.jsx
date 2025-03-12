import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';

const HeaderContainer = styled.header`
  height: 60px;
  display: flex;
  padding: 0 2rem;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  background: #fafafa;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }

  @media (max-width: 480px) {
    height: 60px;
    flex-direction: row;
  }
`;

const LeftNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 480px) {
    display: none; // Скрываем на мобильных устройствах
  }
`;

const RightNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto; // Сдвигаем вправо

  @media (max-width: 480px) {
    display: none; // Скрываем на мобильных устройствах
  }
`;

const MobileNav = styled.nav`
  display: none;

  @media (max-width: 480px) {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
    position: absolute;
    top: 60px;
    left: 0;
    background: #fafafa;
    border-bottom: 1px solid #ccc;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
    padding: 1rem 0;
    z-index: 1000;
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

const BurgerIcon = styled.div`
  display: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: #333;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
  position: absolute; // Абсолютное позиционирование
  top: 5px; 
  right: 10px;

  @media (max-width: 480px) {
    display: block;
  }
`;

export default function Header() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
        closeMenu();
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <HeaderContainer>
            <LeftNav>
                <NavLink to="/">Главная</NavLink>
                {user && <NavLink to="/my-account">Мой аккаунт</NavLink>}
                {user && <NavLink to="/my-polls">Мои опросы</NavLink>}
            </LeftNav>

            <RightNav>
                {user ? (
                    <NavLink onClick={handleLogout}>Выйти</NavLink>
                ) : (
                    <>
                        <NavLink to="/login">Войти</NavLink>
                        <NavLink to="/register">Регистрация</NavLink>
                    </>
                )}
            </RightNav>

            <BurgerIcon onClick={toggleMenu}>
                {isMenuOpen ? <FaTimes /> : <FaBars />}
            </BurgerIcon>

            <MobileNav $isOpen={isMenuOpen}>
                <NavLink to="/" onClick={closeMenu}>Главная</NavLink>
                {user && <NavLink to="/my-account" onClick={closeMenu}>Мой аккаунт</NavLink>}
                {user && <NavLink to="/my-polls" onClick={closeMenu}>Мои опросы</NavLink>}
                {user ? (
                    <NavLink onClick={handleLogout}>Выйти</NavLink>
                ) : (
                    <>
                        <NavLink to="/login" onClick={closeMenu}>Войти</NavLink>
                        <NavLink to="/register" onClick={closeMenu}>Регистрация</NavLink>
                    </>
                )}
            </MobileNav>
        </HeaderContainer>
    );
}