import { GetServerSideProps } from 'next';
import React from 'react';
import Head from 'next/head';

export const getServerSideProps: GetServerSideProps = async () => {
  return { redirect: { destination: '/about', permanent: false } };
};

const Register: React.FC = () => {
  return (
    <>
      <Head>
        <title>Register - MistCurrent</title>
      </Head>
      <div className="min-h-screen bg-white" />
    </>
  );
};

export default Register;
