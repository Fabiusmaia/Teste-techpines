import React from 'react'
import { Input, Button } from 'antd'

interface Props {
  newLink: string
  setNewLink: (v: string) => void
  onSubmit: () => void
  isLoading: boolean
}

const SuggestSongForm: React.FC<Props> = ({
  newLink,
  setNewLink,
  onSubmit,
  isLoading,
}) => {
  return (
    <div style={{ marginTop: 30 }}>
      <Input
        placeholder="Link do YouTube"
        value={newLink}
        onChange={(e) => setNewLink(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <Button type="primary" onClick={onSubmit} loading={isLoading} block>
        Sugerir
      </Button>
    </div>
  )
}

export default SuggestSongForm
