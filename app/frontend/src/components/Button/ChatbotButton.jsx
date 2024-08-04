import React, { useState } from 'react';
import axios from 'axios';
import styles from './ChatbotButton.module.css';

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello, I am the AI ChatBot! I’m here to help you with anything you’re looking for. Please provide your descriptions below and I’ll show the relevant content.' }
  ]);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (message) => {
    if (message.trim() !== '') {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', text: message }
      ]);

      try {
        const payload = {
          session_id: "1", 
          query: message
        };

        console.log('Sending message to backend:', payload);
        const response = await axios.post('http://127.0.0.1:8000/chat', payload, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log('Backend response:', response);

        if (response.status === 200) {
          const data = response.data;
          setMessages((prevMessages) => [
            ...prevMessages,
            { sender: 'bot', text: data.response }
          ]);
        } else {
          console.error('Server responded with an error:', response.status, response.statusText);
        }
      } catch (error) {
        if (error.response) {
          console.error('Server response error:', error.response.data);
        } else if (error.request) {
          console.error('Network error, no response received:', error.request);
        } else {
          console.error('Error in setting up request:', error.message);
        }
      }
    }
  };

  return (
    <div className={styles.chatbotContainer}>
      <button className={styles.chatbotButton} onClick={handleButtonClick}>
        <svg width="62" height="62" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="62" height="62" rx="8" fill="#15171B" />
          <mask id="mask0_85_9859" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="2" y="2" width="57" height="57">
            <path fillRule="evenodd" clipRule="evenodd" d="M2.58301 2.58411H58.1066V58.1098H2.58301V2.58411Z" fill="white" />
          </mask>
          <g mask="url(#mask0_85_9859)">
            <path fillRule="evenodd" clipRule="evenodd" d="M15.7798 50.8279C17.2781 50.8279 18.6912 51.3962 20.187 51.9981C29.3501 56.2348 40.1871 54.3076 47.2474 47.2499C56.5629 37.9293 56.5629 22.7677 47.2474 13.4522C42.7369 8.94169 36.7384 6.45911 30.3524 6.45911C23.9638 6.45911 17.9627 8.94427 13.4548 13.4548C6.39197 20.5124 4.46997 31.3495 8.66789 40.4248C9.27239 41.9205 9.85622 43.3775 9.85622 44.8914C9.85622 46.4026 9.33697 47.9242 8.87972 49.2675C8.50255 50.3732 7.93164 52.042 8.29847 52.4089C8.65755 52.7809 10.3367 52.1944 11.445 51.8147C12.7754 51.36 14.2841 50.8382 15.7798 50.8279ZM30.2878 58.1103C26.3405 58.1103 22.3673 57.2759 18.6499 55.5554C17.5546 55.1162 16.529 54.7029 15.7927 54.7029C14.9454 54.708 13.8061 55.1007 12.7056 55.4804C10.4478 56.2554 7.63714 57.2216 5.55755 55.1498C3.48572 53.0754 4.44155 50.2724 5.21139 48.0172C5.59114 46.9064 5.98122 45.7594 5.98122 44.8914C5.98122 44.1784 5.63764 43.269 5.11064 41.9593C0.272054 31.5097 2.50922 18.9159 10.7165 10.7139C15.9555 5.47227 22.9279 2.58411 30.3498 2.58411C37.7717 2.58411 44.7467 5.46969 49.9857 10.7113C60.8151 21.5406 60.8151 39.1589 49.9857 49.9883C44.677 55.2996 37.5289 58.1103 30.2878 58.1103Z" fill="#F7F5FF"/>
          </g>
          <path fillRule="evenodd" clipRule="evenodd" d="M40.5487 34.0044C39.1227 34.0044 37.9551 32.8497 37.9551 31.4211C37.9551 29.9925 39.0995 28.8378 40.5255 28.8378H40.5487C41.9747 28.8378 43.1321 29.9925 43.1321 31.4211C43.1321 32.8497 41.9747 34.0044 40.5487 34.0044Z" fill="#F7F5FF"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M30.1923 34.0044C28.7663 34.0044 27.5986 32.8497 27.5986 31.4211C27.5986 29.9925 28.7405 28.8378 30.169 28.8378H30.1923C31.6183 28.8378 32.7756 29.9925 32.7756 31.4211C32.7756 32.8497 31.6183 34.0044 30.1923 34.0044Z" fill="#F7F5FF"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M19.8349 34.0044C18.4089 34.0044 17.2412 32.8497 17.2412 31.4211C17.2412 29.9925 18.3856 28.8378 19.8116 28.8378H19.8349C21.2609 28.8378 22.4182 29.9925 22.4182 31.4211C22.4182 32.8497 21.2609 34.0044 19.8349 34.0044Z" fill="#F7F5FF"/>
        </svg>
      </button>

      <div className={`${styles.chatbotModal} ${isOpen ? styles.open : ''}`}>
        <div className={styles.chatbotContent}>
          <h2 className={styles.chatbotTitle}>AI ChatBot</h2>
          <div className={styles.messagesBackground}>
            <div className={styles.messagesContainer}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.sender === 'bot'
                      ? styles.botMessage
                      : styles.userMessage
                  }
                >
                  {message.text}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              className={styles.inputField}
              placeholder="Insert text"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage(e.target.value);
                  e.target.value = '';
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotButton;
