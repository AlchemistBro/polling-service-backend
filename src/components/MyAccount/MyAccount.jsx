import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from '../../context/AuthContext/AuthContext';

const AccountContainer = styled.section`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
  text-align: left;
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
  margin: 0 0 -0.5rem 0;
`;

const PollOption = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0.5rem 0;
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

const UserInfo = styled.div`
  font-size: 1.1rem;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
`;


export default function Account() {
  const { user } = useContext(AuthContext);
  const [votedPolls, setVotedPolls] = useState([]);

  useEffect(() => {
      if (!user) return; // Если user равен null, прекращаем выполнение

      async function fetchVotedPolls() {
          try {
              const response = await fetch(`http://127.0.0.1:9090/polling_api/get_voted_polls/${user.username}/`);
              if (!response.ok) throw new Error('Ошибка при загрузке данных');
              const data = await response.json();
              setVotedPolls(data);
          } catch (err) {
              console.error('Ошибка:', err);
          }
      }
      fetchVotedPolls();
  }, [user]);

  if (!user) {
      return <AccountContainer>Загрузка данных пользователя...</AccountContainer>;
  }

  return (
      <AccountContainer>
          <Title>Мой аккаунт</Title>
          <UserInfo>
              <strong>Мой никнейм: </strong>{user.username}
              <br />
              <strong>Дата регистрации: </strong>{user.registration_date}
          </UserInfo>
          <h2>Опросы, за которые я проголосовал:</h2>
          <br />
          <PollsList>
              {votedPolls.map((poll) => (
                  <PollItem key={poll.id}>
                      <PollTitle>{poll.title}</PollTitle>
                      <PollOption>Выбранный вариант: {poll.selectedOption}</PollOption>
                      <PollLink to={`/poll/${poll.id}`}>Перейти к опросу</PollLink>
                  </PollItem>
              ))}
          </PollsList>
      </AccountContainer>
  );
}