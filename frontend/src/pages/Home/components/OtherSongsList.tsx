import React from 'react'
import { List, Pagination, Button, Spin } from 'antd'
import {
  YoutubeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import type { Song } from '../../../hooks/useSongs'
import Title from 'antd/es/typography/Title'
import { useDeleteSong, useUpdateSong } from '../../../hooks/useSongs'
import { toast } from 'react-toastify'

interface OtherSongsListProps {
  songs: Song[]
  page: number
  setPage: (p: number) => void
  pageSize?: number
  total: number
  isLoggedIn: boolean
  isLoading?: boolean
}

const OtherSongsList: React.FC<OtherSongsListProps> = ({
  songs,
  page,
  setPage,
  pageSize = 5,
  total,
  isLoggedIn,
  isLoading = false,
}) => {
  const deleteSong = useDeleteSong()
  const updateSong = useUpdateSong()

  const handleDelete = (id: number) => {
    deleteSong.mutate(id, {
      onSuccess: () => toast.success('Música deletada!'),
      onError: () => toast.error('Erro ao deletar música'),
    })
  }

  const handleEdit = (song: Song) => {
    const newLink = prompt('Novo link do YouTube:', song.youtube_link)
    if (!newLink) return

    updateSong.mutate(
      { id: song.id, data: { youtube_link: newLink } },
      {
        onSuccess: () => toast.success('Música atualizada!'),
        onError: () => toast.error('Erro ao atualizar música'),
      },
    )
  }
  return (
    <div>
      <Title level={4} style={{ marginTop: 40 }}>
        Outras músicas
      </Title>

      {isLoading ? (
        <Spin style={{ display: 'block', margin: '20px auto' }} />
      ) : (
        <List
          bordered
          dataSource={songs}
          renderItem={(item: Song) => (
            <List.Item
              actions={[
                <a
                  href={item.youtube_link}
                  target="_blank"
                  rel="noreferrer"
                  key="youtube"
                >
                  <YoutubeOutlined style={{ fontSize: 18, color: 'red' }} />
                </a>,
                isLoggedIn && (
                  <Button
                    key="edit"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => handleEdit(item)}
                  />
                ),
                isLoggedIn && (
                  <Button
                    key="delete"
                    icon={<DeleteOutlined />}
                    danger
                    size="small"
                    onClick={() => handleDelete(item.id)}
                  />
                ),
              ].filter(Boolean)}
            >
              {item.title}
            </List.Item>
          )}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
        <Pagination
          current={page}
          pageSize={pageSize}
          total={total}
          onChange={setPage}
        />
      </div>
    </div>
  )
}

export default OtherSongsList
