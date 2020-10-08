import React from 'react'
import '../styles/UI.css';

export default function PlayerUI({ user }) {
  return (
    <div>
      <h2>{user.id}</h2>
    </div>
  )
}
