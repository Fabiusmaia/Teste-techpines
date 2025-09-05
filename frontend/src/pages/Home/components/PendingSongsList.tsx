import React from 'react'
import { Card, List, Button } from 'antd'
import { YoutubeOutlined } from '@ant-design/icons'
import type { Song, useApproveSong } from '../../../hooks/useSongs'
import { toast } from 'react-toastify'

interface PendingSongsListProps {
  songs: Song[]
  refetch: () => void
  approveSong: ReturnType<typeof useApproveSong>
}

const PendingSongsList: React.FC<PendingSongsListProps> = ({
  songs,
  refetch,
  approveSong,
}) => {
  return (
    <Card style={{ marginTop: 40, borderRadius: 12 }}>
      <h4>🎵 Músicas Pendentes</h4>
      <List
        bordered
        dataSource={songs}
        renderItem={(song: Song) => (
          <List.Item
            actions={[
              <Button
                type="primary"
                onClick={() =>
                  approveSong.mutate(song.id, {
                    onSuccess: () => {
                      toast.success('Música aprovada!')
                      refetch()
                    },
                    onError: () => toast.error('Erro ao aprovar a música'),
                  })
                }
              >
                Aprovar
              </Button>,
              <a href={song.youtube_link} target="_blank" rel="noreferrer">
                <YoutubeOutlined style={{ fontSize: 18, color: 'red' }} />
              </a>,
            ]}
          >
            {song.title}
          </List.Item>
        )}
      />
    </Card>
  )
}

export default PendingSongsList
