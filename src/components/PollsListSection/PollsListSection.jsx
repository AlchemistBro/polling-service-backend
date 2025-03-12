import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const PollsContainer = styled.section`
  padding: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 480px) {
    padding: 1rem;
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
  border: 1px solid var(--primary-color);
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
  margin: 0 0 0.5rem 0;

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const PollLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #3498db;
  color: white;
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
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

export default function PollsListSection() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_PROTOCOL}://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}/polling_api/get_all_polls/`);
                if (!response.ok) throw new Error('Ошибка при загрузке данных');
                const data = await response.json();
                setPolls(data);
            } catch (err) {
                console.error('Ошибка:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPolls();
    }, []);

    return (
        <PollsContainer>
            <Title>Список опросов</Title>
            
            {loading ? (
                <LoadingMessage>Загрузка опросов...</LoadingMessage>
            ) : (
                <PollsList>
                    {polls.map((poll) => (
                        <PollItem key={poll.id}>
                            <PollTitle>{poll.title}</PollTitle>
                            <PollLink to={`/poll/${poll.id}`}>Перейти к опросу</PollLink>
                        </PollItem>
                    ))}
                </PollsList>
            )}
        </PollsContainer>
    );
}