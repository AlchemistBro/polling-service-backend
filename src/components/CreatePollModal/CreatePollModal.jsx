import React, { useState, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { AuthContext } from '../../context/AuthContext/AuthContext';
import { FaTimes, FaPlus } from 'react-icons/fa';

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  position: relative;
  animation: ${fadeIn} 0.3s ease-out;

  @media (max-width: 480px) {
    padding: 1.5rem;
    width: 95%;
  }
`;

const CloseButton = styled.button`
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
  transition: background-color 0.2s;

  &:hover {
    background: #cc0000;
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

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
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

const FieldContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 480px) {
    gap: 0.25rem;
  }
`;

const RemoveButton = styled.button`
  background: #ff4d4d;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background: #cc0000;
  }

  @media (max-width: 480px) {
    padding: 0.25rem;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4d4d;
  font-size: 0.875rem;
  margin-top: -0.5rem;

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

export default function CreatePollModal({ onClose, onSubmit }) {
    const { user } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [fields, setFields] = useState([{ title: '' }]);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!title.trim() || !description.trim() || fields.some(field => !field.title.trim())) {
            setError('Все поля должны быть заполнены.');
            return;
        }

        const fieldTitles = fields.map(field => field.title.toLowerCase());
        const hasDuplicates = new Set(fieldTitles).size !== fieldTitles.length;

        if (hasDuplicates) {
            setError('Варианты ответа не должны повторяться.');
            return;
        }

        setError('');
        const poll = {
            id: Math.floor(Date.now() / 1000),
            author: user.username,
            title,
            description,
            fields: fields.map((field) => ({ title: field.title, votes_list_db: [] })),
        };
        onSubmit(poll);
        onClose();
    };

    const addField = () => {
        if (fields.length >= 10) {
            setError('Максимальное количество вариантов ответа — 10.');
            return;
        }
        setFields([...fields, { title: '' }]);
        setError('');
    };

    const updateField = (index, value) => {
        const newFields = [...fields];
        newFields[index].title = value;
        setFields(newFields);
    };

    const removeField = (index) => {
        const newFields = fields.filter((_, i) => i !== index);
        setFields(newFields);
    };

    return (
        <ModalOverlay>
            <ModalContent>
                <CloseButton onClick={onClose}>
                    <FaTimes />
                </CloseButton>
                <h2>Создать опрос</h2>
                <Form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        placeholder="Название опроса"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextArea
                        placeholder="Описание опроса"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {fields.map((field, index) => (
                        <FieldContainer key={index}>
                            <Input
                                type="text"
                                placeholder="Вариант ответа"
                                value={field.title}
                                onChange={(e) => updateField(index, e.target.value)}
                            />
                            <RemoveButton type="button" onClick={() => removeField(index)}>
                                <FaTimes />
                            </RemoveButton>
                        </FieldContainer>
                    ))}
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <Button type="button" onClick={addField}>
                        <FaPlus /> Добавить вариант
                    </Button>
                    <Button type="submit">Создать опрос</Button>
                </Form>
            </ModalContent>
        </ModalOverlay>
    );
}