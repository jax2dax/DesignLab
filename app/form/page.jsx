"use client";

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 1. Process your form data here (e.g., send to an API route)
    console.log('Form data submitted:', formData);

    // 2. OPTIONAL: If your local tracker doesn't automatically catch the submit event,
    // you can manually trigger your tracker's custom function right here:
    // if (window.tracker) { window.tracker.track('Form Submitted', formData); }
    
    alert('Thank you! Your submission has been recorded.');
  };

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f9fafb',
      fontFamily: 'sans-serif',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          marginBottom: '8px', 
          color: '#111827' 
        }}>
          Get in Touch
        </h1>
        <p style={{ 
          fontSize: '14px', 
          color: '#6b7280', 
          marginBottom: '24px' 
        }}>
          Fill out the form below. Your tracking script will monitor this submission.
        </p>

        {/* The Tracked Form */}
        <form 
          id="tracking-contact-form" 
          name="contact_form" 
          data-conversion="true"
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          {/* Name Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="form-name" style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
              Name
            </label>
            <input 
              type="text" 
              id="form-name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              required 
              placeholder="Your Name"
              style={{ 
                padding: '10px 12px', 
                borderRadius: '6px', 
                border: '1px solid #d1d5db',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Email Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="form-email" style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
              Email Address
            </label>
            <input 
              type="email" 
              id="form-email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              required 
              placeholder="you@example.com"
              style={{ 
                padding: '10px 12px', 
                borderRadius: '6px', 
                border: '1px solid #d1d5db',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Message Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="form-message" style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
              Message
            </label>
            <textarea 
              id="form-message" 
              name="message" 
              value={formData.message}
              onChange={handleChange}
              rows={4}
              required 
              placeholder="How can we help you?"
              style={{ 
                padding: '10px 12px', 
                borderRadius: '6px', 
                border: '1px solid #d1d5db',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Submit Button */}
          <button 
            id="form-submit-btn"
            type="submit" 
            style={{
              marginTop: '6px',
              padding: '12px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          >
            Submit Form
          </button>
        </form>
      </div>
    </main>
  );
}
