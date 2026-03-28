import { useState } from 'react'

interface User {
  id: string
  username: string
  role: 'ADMIN' | 'USER'
}

interface AuthState {
  user: User | null
  isLoading: boolean
}

export function useAuth() {
  const [authState] = useState<AuthState>({
    user: null,
    isLoading: false,
  })

  return authState
}
