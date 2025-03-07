'use client'

import React from 'react';

import AuthForm from "@/components/forms/AuthForm";
import {SignUpSchema} from "@/lib/validation";
import {authWithCredentials} from "@/lib/actions/auth.action";

const SignIn = () => {
    return (
        <AuthForm
            formType="SIGN_IN"
            schema={SignUpSchema}
            defaultValues={{email: '', password: '', name: '', username: ''}}
            onSubmit={authWithCredentials}
        />
    );
};

export default SignIn;