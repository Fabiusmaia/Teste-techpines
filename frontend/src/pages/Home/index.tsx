import React, { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  useTopSongs,
  useOtherSongs,
  useCreateSong,
  usePendingSongs,
  useApproveSong,
  type Song,
} from '../../hooks/useSongs'
import { useProfile } from '../../hooks/useAuth'
import TopSongsList from './components/TopSongsList'
import OtherSongsList from './components/OtherSongsList'
import PendingSongsList from './components/PendingSongsList'
import SuggestSongForm from './components/SuggestSongForm'
import { toast } from 'react-toastify'

const Home: React.FC = () => {
  const [newLink, setNewLink] = useState('')
  const pageSize = 5
  const queryClient = useQueryClient()
  const [pageOthers, setPageOthers] = useState(1)

  const { data: topData, isLoading: topLoading } = useTopSongs()
  const { data: otherData, isLoading: otherLoading } = useOtherSongs(pageOthers)

  const createSong = useCreateSong()
  const { data: pendingSongs, refetch } = usePendingSongs()
  const approveSong = useApproveSong()
  const { data: user } = useProfile()
  const isLoggedIn = !!user

  const handleSuggest = () => {
    if (!newLink.includes('youtube.com') && !newLink.includes('youtu.be')) {
      toast.error('Insira um link válido do YouTube!')
      return
    }

    const payload = {
      youtube_link: newLink,
      approved: isLoggedIn,
    }

    createSong.mutate(payload, {
      onSuccess: () => {
        toast.success('Sugestão enviada!')
        queryClient.invalidateQueries({ queryKey: ['songs', 'top'] })
        queryClient.invalidateQueries({ queryKey: ['songs', 'other'] })
        setNewLink('')
      },
      onError: () => toast.error('Erro ao enviar sugestão'),
    })
  }

  const top5: Song[] = Array.isArray(topData?.data) ? topData.data : []
  const others: Song[] = Array.isArray(otherData?.data) ? otherData.data : []
  const totalOthers = otherData?.total ?? 0

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
      }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px' }}>
        <TopSongsList
          songs={top5}
          isLoggedIn={isLoggedIn}
          isLoading={topLoading}
        />
        <OtherSongsList
          isLoading={otherLoading}
          isLoggedIn={isLoggedIn}
          songs={others}
          page={pageOthers}
          setPage={setPageOthers}
          pageSize={pageSize}
          total={totalOthers}
        />

        {isLoggedIn && pendingSongs && pendingSongs.length > 0 && (
          <PendingSongsList
            songs={pendingSongs}
            approveSong={approveSong}
            refetch={refetch}
          />
        )}

        <SuggestSongForm
          newLink={newLink}
          setNewLink={setNewLink}
          onSubmit={handleSuggest}
          isLoading={createSong.isPending}
        />
      </div>
    </div>
  )
}

export default Home
