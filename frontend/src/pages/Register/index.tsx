// src/pages/Register/index.tsx
import React from 'react'
import RegisterForm from './components/RegisterForm'
import AuthLayout from '../../components/AuthLayout'

const Register: React.FC = () => {
  return (
    <AuthLayout title="Criar Conta">
      <RegisterForm />
    </AuthLayout>
  )
}

export default Register
