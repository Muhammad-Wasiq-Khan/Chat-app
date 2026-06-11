import { useState } from 'react'
import * as storage from './storage'

// One hook in App.jsx — state + localStorage together
export function useStore() {
  const [users, setUsers] = useState(storage.getUsers)
  const [user, setUser] = useState(storage.getLoggedInUser)
  const [messages, setMessages] = useState(storage.getMessages)

  function login(email, password) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].email === email && users[i].password === password) {
        const loggedIn = {
          id: users[i].id,
          name: users[i].name,
          email: users[i].email,
        }
        storage.saveLoggedInUser(loggedIn)
        setUser(loggedIn)
        return true
      }
    }
    return false
  }

  function signup(name, email, password) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].email === email) {
        return false
      }
    }

    const newUser = {
      id: String(Date.now()),
      name,
      email,
      password,
    }

    const newUsers = users.concat(newUser)
    storage.saveUsers(newUsers)
    setUsers(newUsers)

    const loggedIn = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    }
    storage.saveLoggedInUser(loggedIn)
    setUser(loggedIn)
    return true
  }

  function logout() {
    storage.saveLoggedInUser(null)
    setUser(null)
  }

  function sendMessage(fromUserId, toUserId, text) {
    const newMessages = messages.concat({
      id: String(Date.now()),
      fromUserId,
      toUserId,
      text,
    })
    storage.saveMessages(newMessages)
    setMessages(newMessages)
  }

  return {
    users,
    user,
    messages,
    login,
    signup,
    logout,
    sendMessage,
  }
}
