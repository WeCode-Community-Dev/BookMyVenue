import { supabase } from './supabase'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

// In-memory mirror of the current session, kept in sync via
// onAuthStateChange (fires on initial load, sign-in/out, and background
// token refresh). Lets getAccessToken() skip supabase-js's getSession()
// round trip — a localStorage read behind an internal lock that otherwise
// serializes every parallel request a page fires on mount — on the common
// path, while still falling back to the real check when the cache is empty
// or the token is close to expiry.
let cachedSession: Session | null = null

supabase.auth.onAuthStateChange((_event, session) => {
  cachedSession = session
})

const EXPIRY_SLACK_MS = 30_000

function isFresh(session: Session): boolean {
  if (!session.expires_at) return true
  return session.expires_at * 1000 > Date.now() + EXPIRY_SLACK_MS
}

export type SignUpInput = {
  email: string
  password: string
  fullName: string
  phone?: string
  isOwner?: boolean
}

export type SignInInput = {
  email: string
  password: string
}

export async function signUpWithEmail(input: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        full_name: input.fullName,
        phone: input.phone ?? null,
        is_owner: input.isOwner ?? false,
      },
    },
  })
  if (error) throw error
  return data
}

export async function signInWithEmail(input: SignInInput) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  cachedSession = data.session
  return data.session
}

export async function getAccessToken(): Promise<string | null> {
  if (cachedSession && isFresh(cachedSession)) {
    return cachedSession.access_token
  }
  const session = await getSession()
  return session?.access_token ?? null
}

export function onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
  const { data } = supabase.auth.onAuthStateChange(callback)
  return data.subscription
}

export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({ password })
  if (error) throw error
  return data
}
