import React from 'react'
import { Card, List, Typography, Button, Spin, message } from 'antd'
import {
  YoutubeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlayCircleFilled,
} from '@ant-design/icons'
import type { Song } from '../../../hooks/useSongs'
import Title from 'antd/es/typography/Title'
import { useDeleteSong, useUpdateSong } from '../../../hooks/useSongs'

const { Text } = Typography

interface TopSongsListProps {
  songs: Song[]
  isLoggedIn: boolean
  isLoading?: boolean
}

const TopSongsList: React.FC<TopSongsListProps> = ({
  songs,
  isLoggedIn,
  isLoading = false,
}) => {
  const deleteSong = useDeleteSong()
  const updateSong = useUpdateSong()

  const handleDelete = (id: number) => {
    deleteSong.mutate(id, {
      onSuccess: () => message.success('Música deletada!'),
      onError: () => message.error('Erro ao deletar música'),
    })
  }

  const handleEdit = (song: Song) => {
    const newLink = prompt('Novo link do YouTube:', song.youtube_link)
    if (!newLink) return

    updateSong.mutate(
      { id: song.id, data: { youtube_link: newLink } },
      {
        onSuccess: () => message.success('Música atualizada!'),
        onError: () => message.error('Erro ao atualizar música'),
      },
    )
  }

  const getYoutubeId = (url: string) => {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[7].length === 11 ? match[7] : null
  }

  if (isLoading) {
    return <Spin style={{ display: 'block', margin: '50px auto' }} />
  }

  return (
    <>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 30 }}>
        🎶 Top 5 Tião Carreiro & Pardinho
      </Title>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={songs}
        renderItem={(item: Song) => {
          const videoId = getYoutubeId(item.youtube_link)
          const thumbnail = videoId
            ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
            : ''

          return (
            <List.Item>
              <Card
                hoverable
                title={item.title}
                extra={
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a
                      href={item.youtube_link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <YoutubeOutlined style={{ fontSize: 18, color: 'red' }} />
                    </a>
                    {isLoggedIn && (
                      <>
                        <Button
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleEdit(item)}
                        />
                        <Button
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => handleDelete(item.id)}
                        />
                      </>
                    )}
                  </div>
                }
                cover={
                  thumbnail ? (
                    <img
                      alt={item.title}
                      src={thumbnail}
                      style={{
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                      }}
                    />
                  ) : null
                }
                style={{ borderRadius: 12 }}
              >
                <Text
                  strong
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <PlayCircleFilled size={16} style={{ marginRight: 2 }} />
                  {new Intl.NumberFormat('pt-BR').format(item.plays)}
                </Text>
              </Card>
            </List.Item>
          )
        }}
      />
    </>
  )
}

export default TopSongsList
