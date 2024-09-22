import { create } from 'zustand'
import { fetchFromAPI } from '../actions/fetchFromAPI'

const useYouTubeStore = create((set, get) => ({
  videos: {},
  channelDetails: {},
  videoDetails: {},
  
  fetchVideos: async (query, isCategory = false) => {
    const cacheKey = isCategory ? `category-${query}` : `search-${query}`
    
    // Sempre busca novos dados para categorias
    if (isCategory || !get().videos[cacheKey]) {
      const endpoint = isCategory 
        ? `search?part=snippet&q=${query}`
        : `search?part=snippet&q=${query}`

      const data = await fetchFromAPI(endpoint)
      set(state => ({ videos: { ...state.videos, [cacheKey]: data.items } }))
      return data.items
    }

    return get().videos[cacheKey]
  },

  fetchVideoDetails: async (id) => {
    if (get().videoDetails[id]) return get().videoDetails[id]

    const data = await fetchFromAPI(`videos?part=snippet,statistics&id=${id}`)
    set(state => ({ videoDetails: { ...state.videoDetails, [id]: data.items[0] } }))
    return data.items[0]
  },

  fetchRelatedVideos: async (id) => {
    const cacheKey = `related-${id}`
    if (get().videos[cacheKey]) return get().videos[cacheKey]

    const data = await fetchFromAPI(`search?part=snippet&relatedToVideoId=${id}&type=video`)
    set(state => ({ videos: { ...state.videos, [cacheKey]: data.items } }))
    return data.items
  },

  fetchChannelDetails: async (id) => {
    if (get().channelDetails[id]) return get().channelDetails[id]

    const data = await fetchFromAPI(`channels?part=snippet&id=${id}`)
    set(state => ({ channelDetails: { ...state.channelDetails, [id]: data.items[0] } }))
    return data.items[0]
  },

  fetchChannelVideos: async (id) => {
    const cacheKey = `channel-${id}`
    if (get().videos[cacheKey]) return get().videos[cacheKey]

    const data = await fetchFromAPI(`search?channelId=${id}&part=snippet&order=date`)
    set(state => ({ videos: { ...state.videos, [cacheKey]: data.items } }))
    return data.items
  }
}))

export default useYouTubeStore