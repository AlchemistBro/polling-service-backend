import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AuthContext } from '../../context/AuthContext/AuthContext';
import { ErrorMessage } from '../../styles/CommonStyles';

const DetailContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeIn 0.3s ease-out;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const PollInfo = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const PollTitle = styled.h1`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
  text-align: left;

  @media (max-width: 480px) {
    text-align: center;
  }
`;

const PollDescription = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.5;

  strong {
    color: #3498db;
    font-weight: 600;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ResultsContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const ResultItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

const ResultTitle = styled.span`
  font-size: 1rem;
  color: #333;
  font-weight: 500;
  min-width: 120px;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const ProgressBarContainer = styled.div`
  flex: 1;
  background-color: #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  height: 8px;
  min-width: ${(props) => props.minWidth || '100px'};

  @media (max-width: 480px) {
    height: 12px;
    width: 100%;
    min-width: ${(props) => props.minWidth || '100px'};
  }
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background-color: #3498db;
  width: ${(props) => props.percentage}%;
  border-radius: 8px;
  transition: width 0.3s ease;

  @media (max-width: 480px) {
    height: 12px;
  }
`;

const PercentageText = styled.span`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
  min-width: 60px;
  text-align: right;

  @media (max-width: 480px) {
    width: 100%;
    text-align: left;
  }
`;

const VoteButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    background: #2980b9;
    transform: translateY(-2px);
  }

  &:active {
    background: #1c6ea4;
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    width: 100%;
    margin-top: 0.5rem;
  }
`;

const CancelButtonWrapper = styled.div`
  height: ${(props) => (props.isVisible ? 'auto' : '0')};
  visibility: ${(props) => (props.isVisible ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const CancelButton = styled.button`
  background: #ff4d4d;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    background: #cc0000;
    transform: translateY(-2px);
  }

  &:active {
    background: #b30000;
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    margin-top: 1rem;
  }
`;

const WarningMessage = styled.p`
  color: #ff4d4d;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  font-weight: 500;
`;

const ChartContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ChartWrapper = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  flex: 1;

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const ChartTitle = styled.h3`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 1.25rem;
    text-align: center;
  }
`;

export default function PollDetail() {
  const { pollId } = useParams();
  const { user } = useContext(AuthContext);
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showWarning, setShowWarning] = useState(false);
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

  const fetchPoll = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_PROTOCOL}://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}/polling_api/get_poll_by_id/${pollId}/`);
      if (!response.ok) throw new Error('Ошибка при загрузке опроса');
      const data = await response.json();
      setPoll(data);
      setLoading(false);
    } catch (err) {
      console.error('Ошибка:', err);
      setError('Не удалось загрузить опрос');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();
  }, [pollId]);

  const vote = async (optionTitle) => {
    if (!user) {
      setAddPollError("Чтобы проголосовать в опросе нужно войти в аккаунт или зарегистрироваться");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_PROTOCOL}://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}/polling_api/vote/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          poll_id: poll.id,
          username: user.username,
          option_title: optionTitle,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка при голосовании');
      }

      const updatedPoll = await response.json();
      setPoll(updatedPoll.poll);
      setShowWarning(false);
    } catch (err) {
      console.error('Ошибка:', err);
      setError(err.message);
    }
  };

  const cancelVote = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_PROTOCOL}://${import.meta.env.VITE_SERVER_IP}:${import.meta.env.VITE_SERVER_PORT}/polling_api/cancel_vote/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          poll_id: poll.id,
          username: user.username,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка при отмене голоса');
      }

      await fetchPoll();
    } catch (err) {
      console.error('Ошибка:', err);
      setError(err.message);
    }
  };

  const hasUserVoted = () => {
    if (!poll || !user) return false;
    return poll.fields.some((field) => field.votes_list_db.includes(user.username));
  };

  if (!poll) return <></>;

  const totalVotes = poll.fields.reduce((sum, field) => sum + field.votes_list_db.length, 0);

  const chartData = poll.fields.map((field) => ({
    name: field.title,
    votes: field.votes_list_db.length,
  }));

  const COLORS = [
    '#3498db', '#2ecc71', '#e74c3c', '#9b59b6', '#f1c40f',
    '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#d35400'
  ];

  return (
    <DetailContainer>
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

      <PollInfo>
        <PollTitle>{poll.title}</PollTitle>
        <PollDescription>
          <strong>Автор:</strong> {poll.author}
          <br /> <br />
          <strong>Описание:</strong> {poll.description}
        </PollDescription>
      </PollInfo>

      <ResultsContainer>
        <h2>Результаты:</h2>
        <br /> <br />
        {poll.fields.map((field) => {
          const percentage = (field.votes_list_db.length / totalVotes) * 100 || 0;
          return (
            <ResultItem key={field.title}>
              <ResultTitle>{field.title}</ResultTitle>
              <ProgressBarContainer>
                <ProgressBarFill percentage={percentage} />
              </ProgressBarContainer>
              <PercentageText>{percentage.toFixed(2)}%</PercentageText>
              {!hasUserVoted() && (
                <VoteButton onClick={() => vote(field.title)}>Голосовать</VoteButton>
              )}
            </ResultItem>
          );
        })}
        {showWarning && (
          <WarningMessage></WarningMessage>
        )}
        <CancelButtonWrapper isVisible={hasUserVoted()}>
          <CancelButton onClick={cancelVote}>Отменить голос</CancelButton>
        </CancelButtonWrapper>
      </ResultsContainer>

      <ChartContainer>
        <ChartWrapper>
          <ChartTitle>График результатов</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="votes">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <ChartWrapper>
          <ChartTitle>Круговая диаграмма результатов</ChartTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="votes"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </ChartContainer>
    </DetailContainer>
  );
}