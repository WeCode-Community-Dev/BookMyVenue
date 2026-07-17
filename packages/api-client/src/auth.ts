import { supabase } from './supabase'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

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
  return data.session
}

export async function getAccessToken(): Promise<string | null> {
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
