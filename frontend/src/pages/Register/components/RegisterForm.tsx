import React, { useState } from 'react'
import { Form, Input, Button, message, Card, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useRegister } from '../../../hooks/useAuth'
import { toast } from 'react-toastify'

const { Title, Text } = Typography

interface RegisterFormValues {
  name: string
  email: string
  password: string
  password_confirmation: string
}

const RegisterForm: React.FC = () => {
  const navigate = useNavigate()
  const registerMutation = useRegister()
  const [form] = Form.useForm<RegisterFormValues>()

  const onFinish = (values: RegisterFormValues) => {
    if (values.password !== values.password_confirmation) {
      toast.error('As senhas não coincidem!')
      return
    }

    registerMutation.mutate(
      {
        name: values.name,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      },
      {
        onSuccess: (data) => {
          localStorage.setItem('token', data.access_token)
          message.success('Conta criada com sucesso! 🎉')
          navigate('/')
        },
        onError: (err: any) => {
          if (err.response?.status === 422) {
            const fields = Object.entries(err.response.data.errors).map(
              ([key, errors]) => ({
                name: key as keyof RegisterFormValues,
                errors: errors as string[],
              }),
            )

            form.setFields(fields)
          } else {
            message.error(err.response?.data?.message || 'Erro ao criar conta')
          }
        },
      },
    )
  }

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f7f7f7',
      }}
    >
      <Card
        style={{
          width: 800,
          borderRadius: 16,
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
          padding: '40px',
        }}
      >
        <Title level={3} style={{ textAlign: 'center' }}>
          Criar conta ✨
        </Title>
        <Text
          type="secondary"
          style={{ display: 'block', textAlign: 'center', marginBottom: 30 }}
        >
          Preencha os dados para se registrar
        </Text>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Nome"
            name="name"
            rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}
          >
            <Input size="large" placeholder="Digite seu nome" />
          </Form.Item>

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

          <Form.Item
            label="Confirmar Senha"
            name="password_confirmation"
            rules={[
              { required: true, message: 'Por favor, confirme sua senha!' },
            ]}
          >
            <Input.Password size="large" placeholder="Confirme sua senha" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={registerMutation.isPending}
              style={{ height: '50px', fontSize: '16px', fontWeight: 500 }}
            >
              Registrar
            </Button>
          </Form.Item>

          <Form.Item style={{ textAlign: 'center', marginTop: 10 }}>
            <a href="/login" style={{ fontSize: '15px' }}>
              🔑 Já tem conta? Fazer login
            </a>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default RegisterForm
