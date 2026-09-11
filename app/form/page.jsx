/**simple demo for to be tracked by another tracker(nothing app related) */
import { useState } from 'react';

function ContactForm() {
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
    
    // Process form data here (e.g., API call)
    console.log('Form data submitted:', formData);

    // OPTIONAL: If your script doesn't auto-track standard forms,
    // call your tracker's custom function here:
    // window.tracker?.track('Form Submitted', formData);
  };

  return (
    <form 
      id="tracking-contact-form" 
      name="contact_form" 
      onSubmit={handleSubmit}
      style={{
        maxWidth: '400px',
        margin: '20px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        fontFamily: 'sans-serif'
      }}
    >
      <h2>Contact Us</h2>
      
      {/* Name Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label htmlFor="form-name">Name</label>
        <input 
          type="text" 
          id="form-name" 
          name="name" 
          value={formData.name}
          onChange={handleChange}
          required 
          placeholder="Your Name"
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      {/* Email Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label htmlFor="form-email">Email</label>
        <input 
          type="email" 
          id="form-email" 
          name="email" 
          value={formData.email}
          onChange={handleChange}
          required 
          placeholder="your.email@example.com"
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      {/* Message Field */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <label htmlFor="form-message">Message</label>
        <textarea 
          id="form-message" 
          name="message" 
          value={formData.message}
          onChange={handleChange}
          rows="4"
          required 
          placeholder="Type your message..."
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
        />
      </div>

      {/* Submit Button */}
      <button 
        id="form-submit-btn"
        type="submit" 
        style={{
          padding: '10px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Submit
      </button>
    </form>
  );
}
