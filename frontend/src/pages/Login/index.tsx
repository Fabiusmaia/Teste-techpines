import React from 'react'
import LoginForm from './components/LoginForm'
import AuthLayout from '../../components/AuthLayout'

const Login: React.FC = () => {
  return (
    <AuthLayout title="Login">
      <LoginForm />
    </AuthLayout>
  )
}

export default Login
