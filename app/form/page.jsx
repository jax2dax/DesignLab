export default function ContactPage() {
  async function handleSubmit(formData) {
    "use server";
    const data = Object.fromEntries(formData);
    console.log('Form data submitted:', data);
  }

  return (
    <main style={{ maxWidth: '400px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Get in Touch</h1>
      <p>Fill out the form below.</p>

      <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input type="text" name="name" placeholder="Your Name" required />
        <input type="email" name="email" placeholder="you@example.com" required />
        <textarea name="message" placeholder="How can we help you?" required />
        <button type="submit">Submit Form</button>
      </form>
    </main>
  );
}