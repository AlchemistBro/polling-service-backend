import styled, { keyframes } from 'styled-components';

export const ErrorMessage = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  background: #ffebee;
  color: #d32f2f;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: ${({ $isVisible }) => ($isVisible ? 'slideUp 0.3s ease-out' : 'fadeOut 0.3s ease-out')};
  font-weight: 500;
  z-index: 1002;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  pointer-events: ${({ $isVisible }) => ($isVisible ? 'all' : 'none')};

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    top: 10px;
  }

  @keyframes slideUp {
    from {
      transform: translate(-50%, -100%);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;


export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 2rem;
  border: 1px solid var(--primary-color);
  margin-top: 2rem;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.5s ease-out;
`;


export const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #bdc3c7;
  animation: ${keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  `} 2s infinite;
`;

export const EmptyStateText = styled.p`
  font-size: 1.25rem;
  margin: 0;
  color: #34495e;
`;