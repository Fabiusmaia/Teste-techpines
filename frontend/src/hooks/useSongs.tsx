import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'

export interface Song {
  id: number
  title: string
  youtube_link: string
  approved: boolean
  plays: number
  created_at: string
  updated_at: string
}

export interface SuggestSongInput {
  title?: string
  youtube_link: string
}

export const useTopSongs = () => {
  return useQuery({
    queryKey: ['songs', 'top'],
    queryFn: async () => {
      const { data } = await api.get('/songs/top')
      return data as { current_page: number; data: Song[]; total: number }
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  })
}

export const useOtherSongs = (page: number = 1) => {
  return useQuery({
    queryKey: ['songs', 'other', page],
    queryFn: async () => {
      const { data } = await api.get('/songs/other', { params: { page } })
      return data as { current_page: number; data: Song[]; total: number }
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  })
}

export const usePendingSongs = () => {
  return useQuery({
    queryKey: ['pending_songs'],
    queryFn: async () => {
      const res = await api.get('/songs/pending')
      return res.data as Song[]
    },
    enabled: !!localStorage.getItem('token'),
  })
}

export const useCreateSong = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Song>) => {
      const res = await api.post('/songs', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs', 'top'] })
      queryClient.invalidateQueries({ queryKey: ['songs', 'other'] })
    },
  })
}

export const useUpdateSong = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Song> }) => {
      const res = await api.put(`/songs/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs', 'top'] })
      queryClient.invalidateQueries({ queryKey: ['songs', 'other'] })
    },
  })
}

export const useDeleteSong = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/songs/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs', 'top'] })
      queryClient.invalidateQueries({ queryKey: ['songs', 'other'] })
    },
  })
}

export const useApproveSong = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.put(`/songs/approve/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs', 'top'] })
      queryClient.invalidateQueries({ queryKey: ['songs', 'other'] })
    },
  })
}
