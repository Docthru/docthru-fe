import styles from './form.module.css';
import { FormProvider, useForm } from 'react-hook-form';
import Input from './Input';
import PasswordInput from './PasswordInput';
import { AUTH } from '@/variables/formValidation';
import { useEffect, useState } from 'react';
import Loader from '../common/Loader';
import { useAuth } from '@/hooks/useAuth';

export default function SignUpForm() {
  const formMethods = useForm();
  const { signUp, isLoading } = useAuth();

  const {
    handleSubmit,
    formState: { isValid },
    reset,
  } = formMethods;

  const handleSignUpSubmit = (data) => {
    const filterData = {
      email: data.email,
      nickname: data.nickname,
      password: String(data.password),
    };

    console.log('just before submit', filterData);

    signUp.mutate(filterData);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <FormProvider {...formMethods}>
        <form
          className={styles.AuthForm}
          onSubmit={handleSubmit(handleSignUpSubmit)}
        >
          <Input
            name="email"
            label="이메일"
            type="email"
            validations={AUTH.EMAIL}
          />
          <Input
            name="nickname"
            label="닉네임"
            type="text"
            validations={AUTH.NICKNAME}
          />
          <PasswordInput
            name="password"
            label="비밀번호"
            validations={AUTH.PASSWORD}
          />
          <PasswordInput
            name="passwordConfirmation"
            label="비밀번호 확인"
            validations={AUTH.CONFIRM_PW}
          />
          <button
            type="submit"
            className={styles['submit-btn']}
            disabled={!isValid}
          >
            가입하기
          </button>
        </form>
      </FormProvider>
    </>
  );
}
