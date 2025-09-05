import React from 'react'
import { Layout, Button, Typography, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useProfile, useLogout } from '../hooks/useAuth'

const { Header } = Layout
const { Text } = Typography

const AppHeader: React.FC = () => {
  const navigate = useNavigate()
  const { data: user } = useProfile()
  const logoutMutation = useLogout()

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        message.success('Logout realizado com sucesso!')
        navigate('/login')
      },
      onError: () => message.error('Erro ao sair da conta'),
    })
  }

  return (
    <Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        background: '#001529',
      }}
    >
      <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
        Top 5 Tião Carreiro e Pardinho 🎵
      </Text>

      <div>
        {!user && (
          <>
            <Button
              type="default"
              style={{ marginRight: 8 }}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button type="primary" onClick={() => navigate('/register')}>
              Cadastrar
            </Button>
          </>
        )}

        {user && (
          <Button type="primary" danger onClick={handleLogout}>
            Logout
          </Button>
        )}
      </div>
    </Header>
  )
}

export default AppHeader
