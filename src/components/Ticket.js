import React from 'react';
import { Image, Transformation } from 'cloudinary-react';
import PropTypes from 'prop-types';


const Ticket = ({ ticketData }) => {
  if (!ticketData || !ticketData.name || !ticketData.email || !ticketData.photo) {
    return (
      <div className="ticket ticket-error" aria-live="polite">
        <p>Invalid ticket data. Please check your information and try again.</p>
      </div>
    );
  }

  return (
    <div className="ticket" aria-labelledby="ticket-heading">
      <h2 id="ticket-heading" className="ticket-title">Conference Ticket</h2>

      
      <div className="ticket-content">
        <div className="ticket-photo">
          <Image
            cloudName={process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'your_cloud_name'}
            publicId={ticketData.photo}
            alt={`${ticketData.name}'s avatar`}
            loading="lazy"
          >

            <Transformation width="150" height="150" crop="fill" />
          </Image>
        </div>
        
        <div className="ticket-details">
          <p><strong>Name:</strong> {ticketData.name}</p>
          <p><strong>Email:</strong> {ticketData.email}</p>
          <p><strong>Ticket ID:</strong> {ticketData.id}</p>
        </div>
      </div>
      
      <p className="ticket-instructions">
        Please present this ticket at the registration desk.
      </p>
    </div>
  );
};

Ticket.propTypes = {
  ticketData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    id: PropTypes.string
  })
};

export default Ticket;
