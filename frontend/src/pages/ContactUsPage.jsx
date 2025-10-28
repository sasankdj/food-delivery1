import React, { useState } from 'react';
import axios from 'axios';

const ContactUsPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' or 'error'

    const { name, email, subject, message } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setSubmissionStatus(null); // Reset status
        try {
            await axios.post('/api/contact', formData);
            setSubmissionStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
        } catch (error) {
            console.error('Error submitting contact form:', error.response?.data || error.message);
            setSubmissionStatus('error');
        }
    };

    return (
        <div className="container mx-auto mt-10 p-4">
            <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>
            <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-8">
                {submissionStatus === 'success' && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                        <p className="font-bold">Success!</p>
                        <p>Your message has been sent. We will get back to you shortly.</p>
                    </div>
                )}
                {submissionStatus === 'error' && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                        <p className="font-bold">Error!</p>
                        <p>There was an issue sending your message. Please try again later.</p>
                    </div>
                )}
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input type="text" id="name" name="name" value={name} onChange={onChange} required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input type="email" id="email" name="email" value={email} onChange={onChange} required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">Subject (Optional)</label>
                        <input type="text" id="subject" name="subject" value={subject} onChange={onChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                        <textarea id="message" name="message" value={message} onChange={onChange} required rows="5"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                    </div>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ContactUsPage;