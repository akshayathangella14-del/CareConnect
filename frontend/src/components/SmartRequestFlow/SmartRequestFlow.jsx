import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, CheckCircle2, Navigation } from 'lucide-react';
import styles from './SmartRequestFlow.module.css';
import { useAskConciergeMutation } from '@/features/ai/aiApi';
import { useCreateServiceRequestMutation, useSubmitServiceRequestMutation } from '@/features/serviceRequests/serviceRequestApi';
import { useNavigate } from 'react-router-dom';

const SmartRequestFlow = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I am the CareConnect AI Concierge. What home service do you need help with today? (e.g., "My AC is leaking water")' }
  ]);
  const [input, setInput] = useState('');
  const [estimate, setEstimate] = useState(null);
  
  const [askConcierge, { isLoading }] = useAskConciergeMutation();
  const [createRequest, { isLoading: isCreating }] = useCreateServiceRequestMutation();
  const [submitRequest] = useSubmitServiceRequestMutation();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, estimate, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    const newMessages = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await askConcierge({ conversationHistory: newMessages }).unwrap();
      
      if (response.data?.needsClarification) {
        setMessages(prev => [...prev, { role: 'ai', text: response.data.question }]);
      } else if (response.data && !response.data.needsClarification) {
        setEstimate(response.data);
        setMessages(prev => [...prev, { role: 'ai', text: 'Got it! Here is my diagnosis and a predicted cost estimate.' }]);
      }
    } catch (error) {
      console.error('Failed to ask AI:', error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am having trouble connecting right now. Please try again or use the standard form.' }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleBook = async () => {
    if (!estimate) return;
    
    try {
      const payload = {
        title: estimate.title,
        category: estimate.categoryId,
        description: estimate.technicalBrief,
        urgency: estimate.urgency || 'NORMAL',
        location: {
          addressLine1: 'To be provided',
          city: 'To be provided',
          state: 'To be provided',
          postalCode: '000000',
          serviceArea: 'General'
        },
        preferredSchedule: {
          startAt: new Date(Date.now() + 86400000).toISOString(),
          endAt: new Date(Date.now() + 86400000 + 7200000).toISOString()
        }
      };
      
      const res = await createRequest(payload).unwrap();
      const newRequestId = res?.data?.serviceRequest?._id || res?.serviceRequest?._id || res?._id;
      
      if (newRequestId) {
        try {
          await submitRequest(newRequestId).unwrap();
        } catch (e) {
          console.warn('Failed to auto-submit', e);
        }
        navigate(`/service-requests/${newRequestId}`);
      }
    } catch (error) {
      console.error('Failed to create request:', error);
      alert('Failed to submit request automatically. Please use the standard form.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}><Sparkles size={24} /> Smart Request AI</h2>
        <p className={styles.subtitle}>Get an instant diagnosis and price estimate.</p>
      </div>
      
      <div className={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`${styles.message} ${msg.role === 'user' ? styles.messageUser : styles.messageAi}`}>
            {msg.text}
          </div>
        ))}
        
        {isLoading && (
          <div className={styles.typingIndicator}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        )}

        {estimate && (
          <div className={styles.estimateCard}>
            <div className={styles.estimateHeader}>
              <span className={styles.estimateTitle}>{estimate.problemType}</span>
              <span className={styles.estimatePrice}>₹{estimate.estimatedPriceMin} - ₹{estimate.estimatedPriceMax}</span>
            </div>
            <div className={styles.estimateBody}>
              <strong>Diagnosis:</strong> {estimate.technicalBrief}
            </div>
            <button onClick={handleBook} disabled={isCreating} className={styles.bookButton}>
              {isCreating ? 'Booking...' : 'Book This Service'}
            </button>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>
      
      {!estimate && (
        <div className={styles.inputArea}>
          <input
            className={styles.inputField}
            placeholder="Describe your issue..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button className={styles.sendButton} onClick={handleSend} disabled={!input.trim() || isLoading}>
            <Send size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartRequestFlow;
