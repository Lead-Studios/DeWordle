"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { Formik, Form, Field } from "formik";
import { signUpSchema } from "@/utils/authValidationSchema";
import { useSignup } from "@/app/hooks/useSignup";

const SignUpForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formEmpty, setFormEmpty] = useState(true);

  const { mutate, isSuccess, isError, error, isPending } = useSignup();

  useEffect(() => {
    if (isSuccess) {
      router.push("/signin");
    }
  }, [isSuccess, router]);

  const initialValues = {
    username: "",
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  };

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      console.log("Form submitted with values:", values);

      const userData = {
        userName: values.username,
        email: values.email,
        password: values.password,
      };

      mutate(userData, {
        onError: (err) => {
          console.error("Submission error:", err);
          setStatus({
            error:
              err.response?.data?.message ||
              "Something went wrong. Please try again.",
          });
          setSubmitting(false);
        },
      });
    } catch (error) {
      console.error("Submission error:", error);
      setStatus({ error: "Something went wrong. Please try again." });
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 bg-white font-manrope">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="md:text-[48px] text-[35px] font-[600] text-[#29296E]">
            Get Started
          </h1>
          <p className="text-gray-600 mt-2 text-[24px] font-[400]">
            Create your account
          </p>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={signUpSchema}
          onSubmit={handleSubmit}
        >
          {({
            errors,
            touched,
            isSubmitting,
            status,
            values,
            setSubmitting,
            setStatus,
          }) => {
            useEffect(() => {
              if (
                values.username ||
                values.fullname ||
                values.email ||
                values.password ||
                values.confirmPassword
              ) {
                setFormEmpty(false);
              } else {
                setFormEmpty(true);
              }
            }, [values]);

            return (
              <Form className="space-y-4">
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium mb-1 text-gray-500"
                  >
                    Username
                  </label>
                  <Field
                    name="username"
                    type="text"
                    className={`w-full px-3 py-2 border ${
                      touched.username && errors.username
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                    placeholder="Enter your name/nickname"
                  />
                  {touched.username && errors.username && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.username}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="fullname"
                    className="block text-sm font-medium mb-1 text-gray-500"
                  >
                    Full name
                  </label>
                  <Field
                    name="fullname"
                    type="text"
                    className={`w-full px-3 py-2 border ${
                      touched.fullname && errors.fullname
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                    placeholder="Enter your name"
                  />
                  {touched.fullname && errors.fullname && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.fullname}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1 text-gray-500"
                  >
                    Email
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className={`w-full px-3 py-2 border ${
                      touched.email && errors.email
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                    placeholder="Enter your email"
                  />
                  {touched.email && errors.email && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-1 text-gray-500"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className={`w-full px-3 py-2 border ${
                        touched.password && errors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.password}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium mb-1 text-gray-500"
                  >
                    Confirm password
                  </label>
                  <div className="relative">
                    <Field
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className={`w-full px-3 py-2 border ${
                        touched.confirmPassword && errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none "
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                {status && status.error && (
                  <div className="text-red-500 text-sm">{status.error}</div>
                )}

                <div className="mt-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <Field
                        name="terms"
                        type="checkbox"
                        id="terms"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="terms"
                        className="font-medium text-gray-700"
                      >
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-500"
                        >
                          Terms and Conditions
                        </a>
                      </label>
                      {touched.terms && errors.terms && (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.terms}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isPending || formEmpty}
                  className={`w-full bg-[#29296E] hover:bg-indigo-800 text-white py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-6 ${
                    formEmpty ? "opacity-40" : "opacity-100"
                  } flex items-center justify-center min-h-[44px]`}
                >
                  {isSubmitting || isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>

                <div className="my-6 flex items-center justify-center">
                  <span className="mx-4 text-gray-500 text-sm">or</span>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default SignUpForm;
