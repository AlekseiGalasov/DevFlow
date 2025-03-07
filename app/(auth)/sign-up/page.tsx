'use client'

import React from 'react';

import AuthForm from "@/components/forms/AuthForm";
import {SignInSchema} from "@/lib/validation";
import {loginWithCredentials} from "@/lib/actions/auth.action";

const SignUp = () => {
    return (
        <AuthForm
            formType="SIGN_UP"
            schema={SignInSchema}
            defaultValues={{email: '', password: ''}}
            onSubmit={loginWithCredentials}
        />
    );
};

export default SignUp;