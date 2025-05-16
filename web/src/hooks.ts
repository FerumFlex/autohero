import { useQuery, QueryClient, useMutation } from '@tanstack/react-query'
import apiInstance from './API'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24
    }
  }
})

export const useGenerateHeroName = () => {
  return useQuery({
    queryKey: ['hero_name'],
    queryFn: (race: string, class_name: string) => apiInstance.generateHeroName(race, class_name),
    staleTime: 1000,
  })
}

export const useCreateHero = () => {
  return useMutation({
    mutationFn: (tx: string) => apiInstance.createHero(tx),
  })
}

export const useGetEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => apiInstance.getEvents(),
    refetchInterval: 5000,
  })
}

export const useGetHeroesByOwner = (wallet: string) => {
  return useQuery({
    queryKey: ['heroes', wallet],
    queryFn: () => apiInstance.getHeroesByOwner(wallet),
  })
}

export const useGetHeroes = () => {
  return useQuery({
    queryKey: ['heroes'],
    queryFn: () => apiInstance.getHeroes(),
  })
}
