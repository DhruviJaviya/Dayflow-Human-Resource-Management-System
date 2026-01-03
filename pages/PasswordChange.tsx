
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { validatePassword } from '../utils/authUtils';

const PasswordChange: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { user, updatePassword } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!validatePassword(newPassword)) {
      setError('Password must be 8+ characters long and include an uppercase letter, a lowercase letter, a number, and a special character.');
      return;
    }

    if (newPassword === user?.password) {
      setError('New password cannot be the same as the current system-generated password.');
      return;
    }

    updatePassword(newPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 pt-16">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Security Update</h1>
          <p className="text-gray-500 mt-2">As this is your first login, you must update your password for security purposes.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg text-xs text-indigo-700 space-y-1">
            <p className="font-semibold mb-1 uppercase tracking-wider">Password Requirements:</p>
            <p>• At least 8 characters long</p>
            <p>• One uppercase letter (A-Z)</p>
            <p>• One lowercase letter (a-z)</p>
            <p>• One numeric digit (0-9)</p>
            <p>• One special character (@$!%*#?&)</p>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition-all"
          >
            Change Password & Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordChange;
