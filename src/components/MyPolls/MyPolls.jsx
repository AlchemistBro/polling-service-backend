import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext/AuthContext';
import styled, { keyframes } from 'styled-components';
import CreatePollModal from '../CreatePollModal/CreatePollModal';
import { Link } from 'react-router-dom';
import { ErrorMessage, EmptyStateContainer, EmptyStateIcon, EmptyStateText } from '../../styles/CommonStyles';
import { FaFrown, FaPlus, FaTimes } from 'react-icons/fa';


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
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

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

const DeleteButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #ff4d4d;
  color: white;
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
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

const CreatePollButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #3498db;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;


export default function MyPolls() {
    const { user } = useContext(AuthContext);
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addPollError, setAddPollError] = useState('');
    const [isErrorVisible, setIsErrorVisible] = useState(false);

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

            if (response.status === 400) {
                setAddPollError('Опрос не создан, у вас уже есть такой опрос');
            } else if (!response.ok) {
                throw new Error('Ошибка при добавлении опроса');
            }

            if (response.ok) {
                fetchPolls();
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (error) return <p>{error}</p>;

    return (
        <PollsContainer>
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
            <Title>Мои опросы</Title>
            <CreatePollButton onClick={() => setIsModalOpen(true)}>
                <FaPlus /> Создать опрос
            </CreatePollButton>

            {loading ? (
                <LoadingMessage>Загрузка опросов...</LoadingMessage>
            ) : polls.length > 0 ? (
                <PollsList>
                    {polls.map((poll) => (
                        <PollItem key={poll.id}>
                            <DeleteButton onClick={() => deletePoll(poll.title)}>
                                <FaTimes /> 
                            </DeleteButton>
                            <PollTitle>{poll.title}</PollTitle>
                            <PollLink to={`/poll/${poll.id}`}>Перейти к опросу</PollLink>
                        </PollItem>
                    ))}
                </PollsList>
            ) : (
                <EmptyStateContainer>
                    <EmptyStateIcon>
                        <FaFrown /> 
                    </EmptyStateIcon>
                    <EmptyStateText>У вас пока нет опросов.</EmptyStateText>
                </EmptyStateContainer>
            )}

            {isModalOpen && (
                <CreatePollModal
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={addPoll}
                />
            )}
        </PollsContainer>
    );
}