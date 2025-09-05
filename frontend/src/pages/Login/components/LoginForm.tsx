// src/pages/Login/LoginForm.tsx
import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useLogin } from '../../../hooks/useAuth'
import { toast } from 'react-toastify'

const { Title, Text } = Typography

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const loginMutation = useLogin()

  interface LoginPayload {
    email: string
    password: string
  }

  const onFinish = (values: LoginPayload) => {
    setLoading(true)
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        localStorage.setItem('token', data.access_token)
        toast.success('Login realizado com sucesso!')
        navigate('/')
      },
      onError: (error: any) => {
        toast.error(
          error.response?.data?.message || 'Email ou senha incorretos!',
        )
      },
      onSettled: () => setLoading(false),
    })
  }
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        style={{
          width: 800,
          borderRadius: 16,
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxShadow: '0 12px 30px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ padding: '40px' }}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: 0 }}>
            Bem-vindo 👋
          </Title>
          <Text
            type="secondary"
            style={{ display: 'block', textAlign: 'center', marginBottom: 30 }}
          >
            Faça login para continuar
          </Text>

          <Form<LoginPayload> layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Por favor, insira seu email!' },
              ]}
            >
              <Input size="large" placeholder="Digite seu email" />
            </Form.Item>

            <Form.Item
              label="Senha"
              name="password"
              rules={[
                { required: true, message: 'Por favor, insira sua senha!' },
              ]}
            >
              <Input.Password size="large" placeholder="Digite sua senha" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                style={{ height: '50px', fontSize: '16px', fontWeight: 500 }}
              >
                Entrar
              </Button>
            </Form.Item>

            <Form.Item style={{ textAlign: 'center', marginTop: 10 }}>
              <a href="/register" style={{ fontSize: '15px' }}>
                ✨ Criar conta
              </a>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  )
}

export default LoginForm
