import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext/AuthContext';
import { EmptyStateContainer, EmptyStateIcon, EmptyStateText } from '../../styles/CommonStyles';
import { FaFrown } from 'react-icons/fa';

const AccountContainer = styled.section`
  padding: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  animation: fadeIn 0.3s ease-out;

  @media (max-width: 480px) {
    padding: 1rem;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const PollsList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 2rem;
`;

const PollItem = styled.li`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 480px) {
    padding: 1rem;
    margin-bottom: 1rem;
  }
`;

const PollTitle = styled.h2`
  font-size: 1.25rem;
  color: #34495e;

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const PollOption = styled.p`
  font-size: 0.9rem;
  color: #7f8c8d;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const PollLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #3498db;
  color: white;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background-color: #2980b9;
    transform: translateY(-1px);
  }

  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`;

const UserInfo = styled.div`
  background: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--primary-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;

  strong {
      color: #3498db;
      font-weight: 600;
  }
  

  @media (max-width: 480px) {
    padding: 1rem;
    margin-bottom: 1rem;

    p {
      font-size: 0.9rem;
    }
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
  font-size: 1.1rem;

  @media (max-width: 480px) {
    padding: 1rem;
    font-size: 1rem;
  }
`;

export default function Account() {
    const { user, isLoading } = useContext(AuthContext);
    const [votedPolls, setVotedPolls] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !user) {
            navigate('/', { replace: true });
        }
    }, [user, isLoading, navigate]);

    useEffect(() => {
        if (!user) return;

        const fetchVotedPolls = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_SERVER_PROTOCOL}://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}/polling_api/get_voted_polls/${user.username}/`
                );
                
                if (!response.ok) throw new Error('Ошибка при загрузке данных');
                
                const data = await response.json();
                setVotedPolls(data);
            } catch (err) {
                console.error('Ошибка:', err);
            }
        };

        fetchVotedPolls();
    }, [user]);

    if (isLoading) {
        return <LoadingMessage>Проверка авторизации...</LoadingMessage>;
    }

    if (!user) {
        return null;
    }

    return (
        <AccountContainer>
            <Title>Мой аккаунт</Title>
            
            <UserInfo>
                <strong>Никнейм:</strong> {user.username}
                <br /> <br />
                <strong>Дата регистрации:</strong> {new Date(user.registration_date).toLocaleDateString()}
            </UserInfo>

            <Title>Мои голоса:</Title>
            
            <PollsList>
                {votedPolls.map((poll) => (
                    <PollItem key={poll.id}>
                        <PollTitle>{poll.title}</PollTitle>
                        <PollOption>
                            Мой выбор: {poll.selectedOption}
                        </PollOption>
                        <PollLink to={`/poll/${poll.id}`}>
                            Перейти к опросу
                        </PollLink>
                    </PollItem>
                ))}
                
                {votedPolls.length === 0 && (
                <EmptyStateContainer>
                    <EmptyStateIcon>
                        <FaFrown /> 
                    </EmptyStateIcon>
                    <EmptyStateText>Вы пока не участвовали в опросах</EmptyStateText>
                </EmptyStateContainer>
                )}
            </PollsList>
        </AccountContainer>
    );
}