"use client";

import AuthFormContainer from "@/app/components/AuthFormContainer";
import React from "react";
import * as yup from "yup";
import { Input, Button } from "@material-tailwind/react";
import Link from "next/link";
import { filterFormikErrors } from "@/app/utils/formikHelper";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { signIn } from "next-auth/react";
// import { signIn } from "@/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { SignInCredentials } from "@/app/types";
import { useFormik } from "formik";

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid Email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be atleast 8 characters")
    .required("Password is required"),
});

export default function SignIn() {
  const router = useRouter();
  const {
    values,
    isSubmitting,
    touched,
    errors,
    handleSubmit,
    handleBlur,
    handleChange,
  } = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values: SignInCredentials) => {
      console.log("inside submit");
      const signInRes = await signIn("credentials", {
        ...values,
        redirect: false,
      }).then((callback) => {
        if (callback?.ok) {
          console.log("success");
        }
        if (callback?.error) {
          toast.error(callback.error);
        }
      });
      console.log("before console");
      console.log(signInRes);
    },
  });

  const hSubmit = async () => {
    console.log(values);
    const res = await signIn("credentials", {
      ...values,
      redirect: false,
    });
    console.log(res);
  };

  const errorsToRender = filterFormikErrors(errors, touched, values);

  type valueKeys = keyof typeof values;

  const { email, password } = values;
  const error = (name: valueKeys) => {
    return errors[name] && touched[name] ? true : false;
  };

  return (
    <AuthFormContainer title="Create New Account" onSubmit={handleSubmit}>
      <Input
        name="email"
        label="Email"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error("email")}
        crossOrigin={undefined}
      />
      <Input
        name="password"
        label="Password"
        value={password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error("password")}
        type="password"
        crossOrigin={undefined}
      />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        Sign in
      </Button>
      <div className="flex items-center justify-between">
        <Link href="/auth/signup">Sign Up</Link>
        <Link href="/auth/signup">Forget password</Link>
      </div>
      <div>
        {errorsToRender.map((item) => {
          return (
            <div
              key={item}
              className="flex items-center text-red-500 space-x-0">
              <XMarkIcon className="w-4 h-4" />
              <p className="text-xs">{item}</p>
            </div>
          );
        })}
      </div>
    </AuthFormContainer>
  );
}
