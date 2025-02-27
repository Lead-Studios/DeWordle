'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { handleGoogleSignIn, handleAppleSignIn } from '../utils/auth-actions';
import { useRouter } from 'next/navigation';

const SignInForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Use client-side signIn for credential login
      await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: true,
        callbackUrl: '/',
      });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleClick = async () => {
    try {
      // Client side call to server action
      const result = await handleGoogleSignIn();
      if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  const handleAppleClick = async () => {
    try {
      // Client side call to server action
      const result = await handleAppleSignIn();
      if (result?.url) {
        router.push(result.url);
      }
    } catch (error) {
      console.error('Apple sign-in error:', error);
    }
  };

  return (
    <div className="w-[498px] bg-[#ffffff] max-w-md mx-auto">
      <h1 className="text-[48px] md:text-[48px] text-[#29296E] font-[600] font-roboto text-center mb-10 text-3xl sm:text-4xl">
        Sign In
      </h1>
      <p className="text-[18px] md:text-[20px] font-[400] text-center text-[#373737] mb-6">
        Enter your details to Log In
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="text-[16px] font-[400] text-[#535353] block text-sm mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full px-3 py-2 border text-[16px] placeholder-[#9F9F9F] border-[#535353] rounded-md h-[54px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-[16px] font-[400] text-[#535353] block text-sm mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="appearance-none w-full px-3 py-2 border text-[16px] placeholder-[#9F9F9F] border-[#535353] rounded-md h-[54px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ WebkitAppearance: 'none' }}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="flex justify-end mt-3 mb-6">
            <Link
              href="/forgot-password"
              className="text-sm text-[#29296E] hover:underline"
            >
              forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${
            !formData.email || !formData.password
              ? 'bg-[#656586]'
              : 'bg-[#29296E]'
          } w-full h-[56px] hover:bg-[#12123f] text-white py-2 px-4 rounded-[24px] font-medium focus:outline-none`}
        >
          {isSubmitting ? 'Signing in...' : 'Log In'}
        </button>

        <div className="relative text-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <span className="relative bg-white px-4 text-sm">or</span>
        </div>

        <button
          type="button"
          className="w-full text-[18px] font-[700] h-[59px] flex items-center justify-center gap-2 border border-none rounded-[32px] py-2 px-4 bg-[#F2F2F4] hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={handleGoogleClick}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z"
              fill="#4285F4"
            />
            <path
              d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957273V13.0418C2.43818 15.9832 5.48182 18 9 18Z"
              fill="#34A853"
            />
            <path
              d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957273 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <button
          type="button"
          className="w-full text-[18px] font-[700] h-[59px] flex items-center justify-center gap-2 border border-none rounded-[32px] py-2 px-4 bg-[#F2F2F4] hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={handleAppleClick}
        >
          <svg
            width="18"
            height="22"
            viewBox="0 0 18 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14.9106 11.4142C14.9237 10.1781 15.4241 9.00362 16.3095 8.14096C15.6366 7.22464 14.5804 6.64776 13.4412 6.5469C12.2204 6.41856 11.0399 7.17744 10.4139 7.17744C9.76956 7.17744 8.76318 6.56816 7.72837 6.58938C6.35791 6.63182 5.09392 7.35378 4.38712 8.52836C2.87682 10.9487 3.97052 14.5131 5.41838 16.4685C6.14957 17.4229 7.00456 18.4955 8.12464 18.461C9.21835 18.422 9.63352 17.7471 10.9551 17.7471C12.2678 17.7471 12.6567 18.461 13.8018 18.4399C14.9818 18.422 15.7196 17.4825 16.4193 16.5153C16.9506 15.8014 17.3499 14.9873 17.5938 14.1209C16.5065 13.6476 15.7924 12.6037 14.9106 11.4142Z"
              fill="black"
            />
            <path
              d="M12.3651 4.38756C13.0006 3.60988 13.3151 2.6245 13.2383 1.625C12.2644 1.72128 11.3573 2.17256 10.6745 2.90133C10.0018 3.62398 9.68178 4.59002 9.75366 5.57552C10.733 5.58559 11.7264 5.16753 12.3651 4.38756Z"
              fill="black"
            />
          </svg>
          Continue with Apple
        </button>

        <div className="text-center text-base sm:text-lg md:text-[20px] mt-6">
          New to Dewordle?
          <Link
            href="/signup"
            className="text-[#29296E] font-medium hover:underline ml-1"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignInForm;
