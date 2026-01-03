
import React, { useState } from 'react';
import { findUserByEmail, saveUser } from '../services/dataStore';
import { validatePassword } from '../utils/authUtils';

const ForgotPassword: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    const user = findUserByEmail(email);
    if (!user) {
      setError("This email address doesn't exist in our records.");
      return;
    }
    setError('');
    // Simulate sending OTP
    setStep('otp');
    alert("Simulated: OTP '123456' sent to " + email);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === '123456') {
      setStep('reset');
      setError('');
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!validatePassword(newPassword)) {
      setError('Password must be 8+ chars with Uppercase, Lowercase, Number, and Special character.');
      return;
    }

    const user = findUserByEmail(email);
    if (user) {
      saveUser({ ...user, password: newPassword, isFirstLogin: false });
      setSuccess('Password reset successfully! Redirecting to login...');
      setTimeout(() => onNavigate('login'), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 pt-16">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm border border-green-200">{success}</div>}

        {step === 'email' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <p className="text-gray-500 text-sm">Enter your registered email to receive an OTP.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700">
              Send OTP
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <p className="text-gray-500 text-sm">A 6-digit code was sent to your email.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none tracking-widest text-center text-xl font-bold"
              />
            </div>
            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700">
              Verify OTP
            </button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700">
              Update Password
            </button>
          </form>
        )}

        <button
          onClick={() => onNavigate('login')}
          className="mt-6 w-full text-center text-sm text-indigo-600 font-medium hover:underline"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
