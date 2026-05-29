import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Bot, Sparkles, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

const ChatBot = ({ userRole }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [showTooltip, setShowTooltip] = useState(true);
    const [messages, setMessages] = useState([
        { role: 'bot', text: `Hello! I am your ${userRole} assistant. How can I help you today?` }
    ]);

    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        if (userRole?.toLowerCase() === 'admin') {
            setSuggestions([
                "How many pending applications?",
                "Show approved loans count",
                "Total application summary"
            ]);
        } else {
            setSuggestions([
                "What is the best car loan?",
                "Lowest bike loan interest?",
                "How do I apply for a loan?",
            ]);
        }
    }, [userRole]);

    useEffect(() => {
        // Show for 5 seconds, then hide
        const timer = setTimeout(() => {
            setShowTooltip(false);
        }, 5000);

        return () => clearTimeout(timer); // Cleanup timer if component unmounts
    }, []);

    const chatEndRef = useRef(null);
    const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

    useEffect(scrollToBottom, [messages, isLoading]);

    const handleSend = async (textToSend) => {
        const messageText = textToSend || input;
        if (!messageText.trim() || isLoading) return;

        const userMsg = { role: 'user', text: messageText };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await axios.post(`${API_BASE_URL}/chat`, {
                message: messageText,
                role: userRole,
                history: chatHistory
            });

            const botText = res.data.text;
            setMessages(prev => [...prev, { role: 'bot', text: botText }]);

            setChatHistory(prev => [
                ...prev,
                { role: "user", parts: [{ text: messageText }] },
                { role: "model", parts: [{ text: botText }] }
            ]);

        } catch (err) {
            setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {!isOpen && (
                <div style={styles.fab} onClick={() => setIsOpen(true)}>
                    <MessageCircle color="white" size={32} />
                    {/* Only show if showTooltip is true */}
                    {showTooltip && <span style={styles.fabTooltip}>Need Help?</span>}
                </div>
            )}

            {isOpen && <div style={styles.backdrop} onClick={() => setIsOpen(false)} />}

            {isOpen && (
                <div style={styles.chatWindow}>
                    {/* Header */}
                    <div style={styles.header}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={styles.botIconCircle}>
                                <Bot size={20} color="#007bff" />
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Vehicle Loan Hub AI</div>
                                <div style={{ fontSize: '12px', opacity: 0.8 }}>Logged in as {userRole}</div>
                            </div>
                        </div>
                        <X size={24} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
                    </div>

                    {/* Message Area */}
                    <div style={styles.messageArea}>
                        {messages.map((m, i) => (
                            <div key={i} style={m.role === 'user' ? styles.userBubbleContainer : styles.botBubbleContainer}>
                                <div style={m.role === 'user' ? styles.userBubble : styles.botBubble}>
                                    {m.text}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div style={styles.botBubbleContainer}>
                                <div style={styles.botBubble}>
                                    <Loader2 size={16} className="animate-spin" style={styles.spinner} />
                                    <span style={{ marginLeft: '8px' }}>Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* ALWAYS VISIBLE Suggestions Area */}
                    <div style={styles.suggestionContainer}>
                        <div style={styles.suggestionLabel}>Quick Actions:</div>
                        <div style={styles.suggestionScrollArea}>
                            {suggestions.map((s, i) => (
                                <button key={i} onClick={() => handleSend(s)} style={styles.suggestionChip}>
                                    <Sparkles size={12} style={{ marginRight: '5px' }} />
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input Area */}
                    <div style={styles.inputArea}>
                        <input
                            disabled={isLoading}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message..."
                            style={styles.input}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={isLoading || !input.trim()}
                            style={{
                                ...styles.sendBtn,
                                backgroundColor: (isLoading || !input.trim()) ? '#ccc' : '#007bff'
                            }}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: translate(-50%, -45%) scale(0.95); }
                    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes fadeOut {
                    from { opacity: 1; transform: translateX(0); }
                    to { opacity: 0; transform: translateX(5px); pointer-events: none; }
                }
            `}</style>
        </>
    );
};

const styles = {
    backdrop: {
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 999, backdropFilter: 'blur(3px)',
        zIndex: 9998,
        backdropFilter: 'blur(3px)'
    },
    fab: {
        position: 'fixed', bottom: '30px', right: '30px', width: '65px', height: '65px',
        borderRadius: '50%', backgroundColor: '#007bff', display: 'flex', justifyContent: 'center',
        alignItems: 'center', cursor: 'pointer', boxShadow: '0 6px 16px rgba(0,123,255,0.4)',
        zIndex: 9999,
    },
    fabTooltip: {
        position: 'absolute', left: '-100px', backgroundColor: '#333', color: 'white',
        padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '500'
    },
    chatWindow: {
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '650px', maxWidth: '95vw', height: '600px', maxHeight: '85vh',
        backgroundColor: '#fff', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1000,
        animation: 'fadeInScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        zIndex: 9999,
    },
    header: {
        padding: '20px 25px', background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
        color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    },
    botIconCircle: {
        width: '40px', height: '40px', backgroundColor: '#fff', borderRadius: '50%',
        display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    messageArea: {
        flex: 1, padding: '20px 25px', overflowY: 'auto', backgroundColor: '#f9fafb',
        display: 'flex', flexDirection: 'column', gap: '15px'
    },
    userBubbleContainer: { alignSelf: 'flex-end', maxWidth: '75%' },
    botBubbleContainer: { alignSelf: 'flex-start', maxWidth: '75%' },
    userBubble: {
        backgroundColor: '#007bff', color: '#fff', padding: '12px 18px',
        borderRadius: '20px 20px 0 20px', fontSize: '14px', boxShadow: '0 4px 15px rgba(0,123,255,0.2)'
    },
    botBubble: {
        backgroundColor: '#fff', color: '#1f2937', padding: '12px 18px',
        borderRadius: '20px 20px 20px 0', fontSize: '14px', border: '1px solid #e5e7eb'
    },
    suggestionContainer: {
        padding: '12px 20px', backgroundColor: '#fff', borderTop: '1px solid #f3f4f6',
        display: 'flex', flexDirection: 'column', gap: '8px'
    },
    suggestionLabel: {
        fontSize: '11px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    suggestionScrollArea: {
        display: 'flex', flexWrap: 'nowrap', gap: '8px', overflowX: 'auto',
        paddingBottom: '5px', scrollbarWidth: 'none', // Hides scrollbar in Firefox
        msOverflowStyle: 'none' // Hides scrollbar in IE/Edge
    },
    suggestionChip: {
        backgroundColor: '#f0f7ff', border: '1px solid #bfdbfe', color: '#1d4ed8',
        padding: '6px 14px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', transition: 'all 0.2s ease',
        fontWeight: '500'
    },
    inputArea: {
        padding: '15px 25px 25px 25px', display: 'flex', gap: '12px',
        alignItems: 'center', backgroundColor: '#fff'
    },
    input: {
        flex: 1, border: '1px solid #e5e7eb', borderRadius: '30px', padding: '12px 20px',
        outline: 'none', fontSize: '14px', backgroundColor: '#f9fafb'
    },
    fabTooltip: {
        position: 'absolute', 
        left: '-100px', 
        backgroundColor: '#333', 
        color: 'white',
        padding: '5px 12px', 
        borderRadius: '8px', 
        fontSize: '12px', 
        fontWeight: '500',
        animation: 'fadeOut 0.5s ease 4.5s forwards' // Start fading out at 4.5s
    },
    sendBtn: {
        color: 'white', border: 'none', borderRadius: '50%', width: '48px',
        height: '48px', cursor: 'pointer', display: 'flex', justifyContent: 'center',
        alignItems: 'center'
    },
    spinner: { animation: 'spin 1s linear infinite' }
};

export default ChatBot;