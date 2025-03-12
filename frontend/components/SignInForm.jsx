'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import { signInSchema } from '@/utils/authValidationSchema';

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      // Handle form submission logic here
      console.log('Form submitted:', values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect or perform additional actions on success
    } catch (error) {
      console.error('Submission error:', error);
      setStatus({ error: 'Invalid email or password. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-[498px] bg-[#ffffff] max-w-md mx-auto ">
      <h1 className="text-[48px] md:text-[48px] text-[#29296E] font-[600] font-roboto text-center mb-10 text-3xl sm:text-4xl">
        Sign In
      </h1>
      <p className="text-[18px] md:text-[20px] font-[400] text-center text-[#373737] mb-6">
        Enter your details to Log In
      </p>

      <Formik
        initialValues={initialValues}
        validationSchema={signInSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting, status }) => (
          <Form className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="text-[16px] font-[400] text-[#535353] block text-sm mb-1"
              >
                Email
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className={`w-full px-3 py-2 border text-[16px] placeholder-[#9F9F9F] ${
                  touched.email && errors.email
                    ? 'border-red-500'
                    : 'border-[#535353]'
                } rounded-md h-[54px] focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {touched.email && errors.email && (
                <div className="text-red-500 text-sm mt-1">{errors.email}</div>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-[16px] font-[400] text-[#535353] block text-sm mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Field
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Password"
                  className={`appearance-none w-full px-3 py-2 border text-[16px] placeholder-[#9F9F9F] ${
                    touched.password && errors.password
                      ? 'border-red-500'
                      : 'border-[#535353]'
                  } rounded-md h-[54px] focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
              {touched.password && errors.password && (
                <div className="text-red-500 text-sm mt-1">
                  {errors.password}
                </div>
              )}
              <div className="flex justify-end mt-3 mb-6">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#29296E] hover:underline"
                >
                  forgot password?
                </Link>
              </div>
            </div>

            {status && status.error && (
              <div className="text-red-500 text-sm text-center">
                {status.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#29296E] w-full h-[56px] hover:bg-[#12123f] text-white py-2 px-4 rounded-[24px] font-medium focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing in...' : 'Log In'}
            </button>

            <div className="relative text-center my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="relative bg-white px-4 text-sm">or</span>
            </div>

            <div className="text-center text-base sm:text-lg md:text-[20px] mt-6 ">
              New to Dewordle?
              <Link
                href="/signup"
                className="text-[#29296E] font-medium hover:underline ml-1"
              >
                Sign Up
              </Link>
            </div>
          </Form>
        )}
      </Formik>
      <div className="space-y-4 flex mt-[1em]">
        <button
          type="button"
          className="w-full text-[18px] font-[700] h-[59px] flex items-center justify-center gap-2 border border-none rounded-[32px] py-2 px-4 bg-[#F2F2F4] hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
      </div>
    </div>
  );
};

export default SignInForm;
