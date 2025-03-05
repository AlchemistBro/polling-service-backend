import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext/AuthContext';
import styled from 'styled-components';
import CreatePollModal from '../CreatePollModal/CreatePollModal';
import { Link } from 'react-router-dom';

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
  position: relative;

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
    background-color: rgb(2, 104, 172);
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #ff4d4d;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s, background-color 0.2s;
  font-weight: bold;

  ${PollItem}:hover & {
    opacity: 1;
  }

  &:hover {
    background: #cc0000;
  }
`;

const AddButton = styled(Link)`
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

export default function MyPolls() {
    const { user } = useContext(AuthContext);
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (user && user.username) {
            fetchPolls();
        }
    }, [user]);

    const fetchPolls = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_PROTOCOL}://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}/polling_api/get_polls_by_author/${user.username}/`);
            if (!response.ok) throw new Error('Ошибка при загрузке опросов');
            const data = await response.json();
            setPolls(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const deletePoll = async (pollTitle) => {
        try {
            const encodedTitle = encodeURIComponent(pollTitle);
            const response = await fetch(`${import.meta.env.VITE_SERVER_PROTOCOL}://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}/polling_api/delete_poll/${encodedTitle}/`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Ошибка при удалении опроса');
            fetchPolls(); 
        } catch (err) {
            setError(err.message);
        }
    };

    const addPoll = async (poll) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_PROTOCOL}://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}/polling_api/add_poll/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(poll), 
            });
            if (!response.ok) throw new Error('Ошибка при добавлении опроса');
            fetchPolls(); 
        } catch (err) {
            setError(err.message);
        }
    };

    if (!user) return <p>Пожалуйста, войдите в систему, чтобы увидеть свои опросы.</p>;
    if (!user.username) return <p>Ошибка: имя пользователя не найдено.</p>;
    if (error) return <p>{error}</p>;

    return (
        <PollsContainer>
            
            <Title>Мои опросы</Title>
            <br />
            <AddButton onClick={() => setIsModalOpen(true)}>+ Добавить опрос</AddButton>
            {isModalOpen && (
                <CreatePollModal
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={addPoll}
                />
            )}
            {polls.length > 0 ? (
                <PollsList>
                    {polls.map((poll) => (
                        <PollItem key={poll.id}>
                            <DeleteButton onClick={() => deletePoll(poll.title)}>Удалить опрос</DeleteButton>
                            <PollTitle>{poll.title}</PollTitle>
                            <PollLink to={`/poll/${poll.id}`}>Перейти к опросу</PollLink>
                        </PollItem>
                    ))}
                </PollsList>
            ) : (
                <p>У вас пока нет опросов.</p>
            )}
        </PollsContainer>
    );
}