import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext/AuthContext'; 

import Header from './components/Header/Header';
import PollDetail from './components/PollDetail/PollDetail';
import PollsListSection from './components/PollsListSection/PollsListSection';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
import MyPolls from './components/MyPolls/MyPolls';
import Account from './components/MyAccount/MyAccount'; 

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<PollsListSection />} />
                    <Route path="/poll/:pollId" element={<PollDetail />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/my-polls" element={<MyPolls />} />
                    <Route path="/my-account" element={<Account />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}