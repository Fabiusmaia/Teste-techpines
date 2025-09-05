// src/components/AuthLayout.tsx
import React, { type ReactNode } from 'react'
import { Typography } from 'antd'

const { Title } = Typography

interface AuthLayoutProps {
  title: string
  children: ReactNode
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
      }}
    >
      <div
        style={{
          flex: 1,
          backgroundImage: 'url(/images/tiao-carreiro-e-pardinho.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Title level={2} style={{ textAlign: 'center' }}>
          {title}
        </Title>
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
