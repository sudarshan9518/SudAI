import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChatSidebar.css';

const ChatSidebar = ({ chats, activeChatId, onSelectChat, onNewChat, open }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call logout endpoint to clear cookie on server
      await axios.post("http://localhost:3000/api/auth/logout", {}, {
        withCredentials: true
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Navigate to login regardless of logout response
      navigate('/login');
    }
  };

  return (
    <aside className={"chat-sidebar " + (open ? 'open' : '')} aria-label="Previous chats">
      <div className="sidebar-header">
        <h2>Chats</h2>
        <button className="small-btn" onClick={onNewChat}>New</button>
      </div>
      <nav className="chat-list" aria-live="polite">
        {chats.map(c => (
          <button
            key={c.id}
            className={"chat-list-item " + (c.id === activeChatId ? 'active' : '')}
            onClick={() => onSelectChat(c.id)}
          >
            <span className="title-line">{c.title}</span>
            <span className="meta-line">{c.messages.length} msg{c.messages.length !== 1 && 's'}</span>
          </button>
        ))}
        {chats.length === 0 && <p className="empty-hint">No chats yet.</p>}
      </nav>
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
};

export default ChatSidebar;