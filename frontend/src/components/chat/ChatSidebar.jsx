import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { deleteChat as deleteChatAction, selectChat } from '../../store/chatSlice';
import './ChatSidebar.css';

const ChatSidebar = ({ chats, activeChatId, onSelectChat, onNewChat, open }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Call logout endpoint to clear cookie on server
      await axios.post("https://sudai.onrender.com/api/auth/logout", {}, {
        withCredentials: true
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Navigate to login regardless of logout response
      navigate('/login');
    }
  };

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat?')) {
      try {
        await axios.delete(`https://sudai.onrender.com/api/chat/${chatId}`, {
          withCredentials: true
        });
        dispatch(deleteChatAction(chatId));
        if (activeChatId === chatId) {
          dispatch(selectChat(null));
          onNewChat();
        }
      } catch (err) {
        console.error("Delete chat error:", err);
        alert('Failed to delete chat');
      }
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
          <div key={c._id} className="chat-list-item-wrapper">
            <button
              className={"chat-list-item " + (c._id === activeChatId ? 'active' : '')}
              onClick={() => onSelectChat(c._id)}
            >
              <span className="title-line">{c.title}</span>
            </button>
            <button
              className="delete-chat-btn"
              onClick={(e) => handleDeleteChat(e, c._id)}
              title="Delete chat"
            >
              ×
            </button>
          </div>
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