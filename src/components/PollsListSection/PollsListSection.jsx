import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const PollsContainer = styled.section`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const PollsList = styled.ul`
  list-style: none;
  padding: 0;
`;

const PollItem = styled.li`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const PollTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 1rem 0;
`;

const PollLink = styled(Link)`
  display: inline-block;
  background-color: #3498db;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    background-color:rgb(2, 104, 172);
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.1rem;
  text-align: left;
`;

export default function PollsListSection() {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        async function fetchPolls() {
            const response = await fetch(`${import.meta.env.VITE_SERVER_PROTOCOL}://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}/polling_api/get_all_polls/`);
            const polls = await response.json();
            setPolls(polls);
            setLoading(false);
        }
        fetchPolls();
    }, []);

    return (
        <PollsContainer>
            <Title>Список опросов</Title>
            <br />
            {loading && <p style={{ margin: '1rem' }}>Загрузка списка запросов...</p>}
            {!loading && (
                <PollsList>
                    {polls.map(poll => (
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