import { useQuery } from '@tanstack/react-query'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient, chatEndpoints } from '@venue404/api-client'

export interface ChatMessage {
  id: string
  booking_id: string
  sender_id: string
  message: string
  created_at: string
  read_at: string | null
}

export function useChat(bookingId: string) {
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messageQuery = useQuery({
    queryKey: ['chat-messages', bookingId],
    queryFn: () => chatEndpoints(createClient()).listMessages(bookingId),
    enabled: !!bookingId,
  })
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (messageQuery.data) {
      setMessages(messageQuery.data as ChatMessage[])
    }
  }, [messageQuery.data])

  useEffect(() => {
    let isMounted = true

    const connect = async () => {
      try {
        const websocket = await chatEndpoints(createClient()).connectWebSocket(bookingId)
        
        websocket.onopen = () => {
          if (isMounted) setIsConnected(true)
        }
        
        websocket.onclose = () => {
          if (isMounted) {
            setIsConnected(false)
            reconnectTimeoutRef.current = setTimeout(connect, 3000)
          }
        }
        
        websocket.onmessage = (event) => {
          const data = JSON.parse(event.data)
          if (data.type === 'message_created' || data.type === 'message_sent') {
            setMessages(prev => [...prev, data.payload as ChatMessage])
          }
        }
        
        setWs(websocket)
      } catch (e) {
        console.error('Chat WebSocket error:', e)
        if (isMounted) setIsConnected(false)
      }
    }

    connect()

    return () => {
      isMounted = false
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
      ws?.close()
    }
  }, [bookingId])

  const sendMessage = useCallback((message: string) => {
    if (ws && isConnected) {
      ws.send(JSON.stringify({ type: 'send_message', message }))
    }
  }, [ws, isConnected])

  return {
    messages,
    isLoading: messageQuery.isLoading,
    isConnected,
    sendMessage,
  }
}