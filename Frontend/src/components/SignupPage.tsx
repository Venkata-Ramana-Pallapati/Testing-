import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Login } from './Login';
import {  BarChart, Database, Lock, Mail, User } from 'lucide-react';

interface User {
  name: string;
  email: string;
  password: string;
}

const SignupPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  const handleSignup = () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
    if (users.some((user) => user.email === email)) {
      setMessage("Email already registered!");
      return;
    }
    const newUser: User = { name, email, password };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    setMessage("Signup successful!");
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleBackToLogin = () => {
    setShowLogin(true);
  };

  if (showLogin) {
    return <Login onLogin={() => setShowLogin(false)} />;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 overflow-hidden">
      <motion.div 
        className="relative w-full max-w-md p-8 bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
      >
        {/* Floating Data Visualization Elements */}
        <motion.div 
          className="absolute -top-10 -right-10 text-white/20"
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
        >
          < BarChart size={100} strokeWidth={1} />
        </motion.div>

        <motion.div 
          className="absolute -bottom-10 -left-10 text-white/20"
          animate={{ 
            rotate: [0, -10, 10, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
        >
          <Database size={100} strokeWidth={1} />
        </motion.div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-center text-white mb-8 flex justify-center items-center gap-3">
            < BarChart className="text-cyan-300" /> 
            Sign Up
          </h1>

          {/* Input Fields with Icons */}
          <div className="space-y-4">
            <motion.div 
              className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-3 text-cyan-300"><User /></div>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-white placeholder-white/70 focus:outline-none p-3"
              />
            </motion.div>

            <motion.div 
              className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="p-3 text-cyan-300"><Mail /></div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-white placeholder-white/70 focus:outline-none p-3"
              />
            </motion.div>

            <motion.div 
              className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="p-3 text-cyan-300"><Lock /></div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-white placeholder-white/70 focus:outline-none p-3"
              />
            </motion.div>

            <motion.div 
              className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="p-3 text-cyan-300"><Lock /></div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-transparent text-white placeholder-white/70 focus:outline-none p-3"
              />
            </motion.div>
          </div>

          {/* Buttons */}
          <div className="mt-6 space-y-4">
            <motion.button
              onClick={handleSignup}
              className="w-full bg-cyan-500 text-white p-3 rounded-lg hover:bg-cyan-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Account
            </motion.button>

            <motion.button
              onClick={handleBackToLogin}
              className="w-full bg-white/20 backdrop-blur-sm text-white p-3 rounded-lg hover:bg-white/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Login
            </motion.button>
          </div>

          {/* Message Display */}
          {message && (
            <motion.p 
              className="mt-4 text-center text-lg text-white"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {message}
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;