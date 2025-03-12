import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { ErrorMessage } from '../../styles/CommonStyles';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FormContainer = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  border: 1px solid var(--primary-color);
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.3s ease-out;

  @media (max-width: 768px) {
    margin: 1rem auto;
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    margin: 1rem;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    border-color: #3498db;
    outline: none;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #2980b9;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
    font-size: 0.875rem;
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

export default function RegisterForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [addPollError, setAddPollError] = useState('');
    const [isErrorVisible, setIsErrorVisible] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (addPollError) {
            setIsErrorVisible(true);
            const timer = setTimeout(() => {
                setIsErrorVisible(false);
                setTimeout(() => setAddPollError(''), 300);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [addPollError]);

    const handleCloseError = () => {
        setIsErrorVisible(false);
        setTimeout(() => setAddPollError(''), 300);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_PROTOCOL}://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}/polling_api/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            if (response.status === 400) {
                setAddPollError('Пользователь с таким именем уже существует');
            } else if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Ошибка регистрации');
            }

            if (response.ok) {
                navigate('/login');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <FormContainer>
            {addPollError && (
                <ErrorMessage
                    role="alert"
                    onClick={handleCloseError}
                    title="Закрыть уведомление"
                    $isVisible={isErrorVisible}
                >
                    ⚠️ {addPollError}
                </ErrorMessage>
            )}

            <Title>Регистрация</Title>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <Form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    placeholder="Имя пользователя"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit">Зарегистрироваться</Button>
            </Form>
        </FormContainer>
    );
}