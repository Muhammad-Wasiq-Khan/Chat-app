// Simple localStorage helpers

const KEYS = {
  users: 'chat_users',
  user: 'chat_user',
  messages: 'chat_messages',
}

const DEFAULT_USERS = [
  { id: '1', name: 'Alex', email: 'alex@test.com', password: '123' },
  { id: '2', name: 'Jordan', email: 'jordan@test.com', password: '123' },
  { id: '3', name: 'Sam', email: 'sam@test.com', password: '123' },
]

function getItem(key, fallback) {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getUsers() {
  const users = getItem(KEYS.users, null)
  if (!users) {
    setItem(KEYS.users, DEFAULT_USERS)
    return DEFAULT_USERS
  }
  return users
}

export function saveUsers(users) {
  setItem(KEYS.users, users)
}

export function getLoggedInUser() {
  return getItem(KEYS.user, null)
}

export function saveLoggedInUser(user) {
  if (user) {
    setItem(KEYS.user, user)
  } else {
    localStorage.removeItem(KEYS.user)
  }
}

export function getMessages() {
  return getItem(KEYS.messages, [])
}

export function saveMessages(messages) {
  setItem(KEYS.messages, messages)
}
