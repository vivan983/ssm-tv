export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  is_read: boolean
  created_at: string
}

export interface ContactFormData {
  name: string
  email: string
  subject?: string
  message: string
}
