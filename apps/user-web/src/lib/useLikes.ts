import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient, venueEndpoints } from '@venue404/api-client'
import { useAuth } from './AuthContext'

export function useLikes() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const client = createClient()
  const venuesApi = venueEndpoints(client)

  const { data: likedVenueIds = [] } = useQuery({
    queryKey: ['likes', user?.id],
    queryFn: async () => {
      if (!user) return []
      const res = await venuesApi.getLikedVenueIds()
      return res
    },
    enabled: !!user,
  })

  const { mutate: toggleLike } = useMutation({
    mutationFn: async (venueId: string) => {
      const res = await venuesApi.toggleVenueLike(venueId)
      return { venueId, isLiked: res.is_liked }
    },
    onMutate: async (venueId: string) => {
      await queryClient.cancelQueries({ queryKey: ['likes', user?.id] })
      const previousLikes = queryClient.getQueryData<string[]>(['likes', user?.id]) || []
      
      let newLikes: string[]
      if (previousLikes.includes(venueId)) {
        newLikes = previousLikes.filter((id) => id !== venueId)
      } else {
        newLikes = [...previousLikes, venueId]
      }
      
      queryClient.setQueryData<string[]>(['likes', user?.id], newLikes)
      return { previousLikes }
    },
    onError: (err, venueId, context) => {
      if (context?.previousLikes) {
        queryClient.setQueryData(['likes', user?.id], context.previousLikes)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['likes', user?.id] })
    },
  })

  return {
    likedVenueIds,
    toggleLike,
    isLiked: (venueId: string) => likedVenueIds.includes(venueId),
  }
}
