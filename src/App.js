import React, { useState, useEffect } from 'react';
import './styles/Ticket.css';
import TicketForm from './components/TicketForm';
import Ticket from './components/Ticket';
import localforage from 'localforage';

function App() {
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values, { setSubmitting }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate Cloudinary URL
      if (!values.photo.match(/\.(jpeg|jpg|png)$/i)) {
        throw new Error('Invalid image URL. Please use JPEG, JPG, or PNG format.');
      }

      // Generate ticket data
      const ticketData = {
        ...values,
        id: Math.random().toString(36).substr(2, 9),
        photo: values.photo,
      };

      // Save to local storage
      await localforage.setItem('ticket', ticketData);
      setTicket(ticketData);
    } catch (error) {
      setError(error.message);
      console.error('Error generating ticket:', error);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  // Load saved ticket on mount
  useEffect(() => {
    const loadTicket = async () => {
      try {
        const savedTicket = await localforage.getItem('ticket');
        if (savedTicket) {
          setTicket(savedTicket);
        }
      } catch (error) {
        console.error('Error loading ticket:', error);
      }
    };
    loadTicket();
  }, []);

  return (
    <div className="App" role="main">
      <h1 tabIndex="-1">Conference Ticket Generator</h1>
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      {isLoading ? (
        <div className="loading" aria-live="polite">
          Generating your ticket...
        </div>
      ) : (
        <>
          {!ticket ? (
            <TicketForm onSubmit={handleSubmit} />
          ) : (
            <div>
              <Ticket ticketData={ticket} />
              <button 
                onClick={() => setTicket(null)}
                aria-label="Generate another ticket"
              >
                Generate Another Ticket
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
