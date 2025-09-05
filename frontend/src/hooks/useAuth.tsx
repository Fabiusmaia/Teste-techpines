import { useMutation, useQuery } from '@tanstack/react-query'
import {
  authService,
  type LoginPayload,
  type RegisterPayload,
} from '../services/authService'

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) =>
      authService.login(data).then((res) => res.data),
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterPayload) =>
      authService.register(data).then((res) => res.data),
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      try {
        await authService.logout()
      } catch (err) {
        console.log(err)
      }
      localStorage.removeItem('token')
    },
  })
}

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.profile().then((res) => res.data),
  })
}
