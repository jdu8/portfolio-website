# Portfolio Website - Setup Guide

This guide will help you set up the email delivery and AI chatbot features for your portfolio website.

## Prerequisites

- Vercel account (for deployment)
- Resend account (for emails)
- Google AI Studio account (for chatbot)

---

## Step 1: Set Up Resend for Email Delivery

### 1.1 Get Your Resend API Key

1. Go to [Resend](https://resend.com) and sign up/log in
2. Navigate to **API Keys** in the dashboard
3. Click **Create API Key**
4. Give it a name (e.g., "Portfolio Contact Form")
5. Copy the API key (starts with `re_`)

### 1.2 Update .env.local

Open `.env.local` and add your Resend API key:

```bash
RESEND_API_KEY=re_your_actual_api_key_here
YOUR_EMAIL=your@email.com
```

Replace:
- `re_your_actual_api_key_here` with your actual Resend API key
- `your@email.com` with the email where you want to receive contact form submissions

---

## Step 2: Set Up Gemini AI for Chatbot

### 2.1 Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **Get API Key** or **Create API Key**
4. Copy the API key

### 2.2 Update .env.local

Add your Gemini API key to `.env.local`:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

Replace `your_gemini_api_key_here` with your actual Gemini API key.

---

## Step 3: Deploy to Vercel

### 3.1 Connect Your Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Click **Deploy** (Vercel will auto-detect settings)

### 3.2 Add Environment Variables

After deployment:

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add the following variables:

| Name | Value |
|------|-------|
| `RESEND_API_KEY` | Your Resend API key |
| `YOUR_EMAIL` | Your email address |
| `GEMINI_API_KEY` | Your Gemini API key |

4. Click **Save** for each variable
5. Redeploy your project (Settings → Deployments → click ⋯ → Redeploy)

---

## Step 4: Test Your Features

### 4.1 Test Contact Form

1. Visit your deployed site
2. Go to the Contact section
3. Try **Schedule a Call** and **Send Message**
4. Check your email inbox for notifications

### 4.2 Test AI Chatbot

1. Click the floating chat button (bottom-right corner)
2. Send a test message (e.g., "Tell me about Ishan's experience")
3. The AI should respond with relevant information

---

## Features Overview

### Email Contact Forms

- **Schedule Call**: Send two emails (notification to you + confirmation to visitor)
- **Send Message**: Send one email to you with the visitor's message
- **Rate Limiting**: 10 messages per day per visitor (resets daily)

### AI Chatbot

- **Message Limit**: 20 messages per day per visitor
- **Conversation History**: Stored in browser's localStorage
- **System Prompt**: Configured to answer questions about your portfolio
- **Responsive**: Full-screen on mobile, floating window on desktop

---

## Local Development

### Test Locally with Vercel Dev

```bash
# Install dependencies
npm install

# Run Vercel dev server
vercel dev
```

The dev server will:
- Load environment variables from `.env.local`
- Run serverless functions locally
- Serve your site at `http://localhost:3000`

### Test Without Vercel Dev

If you're using Live Server or similar:
- Email and chat features will show fallback messages
- Data will be logged to browser console
- Forms will still work, but won't send actual emails/chat responses

---

## Customization

### Update AI System Prompt

Edit `/api/chat.js` and modify the `SYSTEM_PROMPT` constant to change how the AI responds.

### Change Rate Limits

- **Contact Messages**: Edit `MESSAGE_LIMIT` in `/js/components/ContactOptions.jsx` (currently 10)
- **Chat Messages**: Edit `MESSAGE_LIMIT` in `/js/components/Chatbot.jsx` (currently 20)

### Customize Email Templates

Edit the `html` content in:
- `/api/send-message.js` (for message notifications)
- `/api/schedule-call.js` (for call request notifications)

---

## Troubleshooting

### Contact Form Not Sending Emails

1. Check `.env.local` has correct `RESEND_API_KEY` and `YOUR_EMAIL`
2. Verify environment variables are set in Vercel Dashboard
3. Check Vercel Function logs for errors

### Chatbot Not Responding

1. Verify `GEMINI_API_KEY` is set correctly
2. Check browser console for errors
3. Ensure you haven't exceeded daily message limit (20)
4. Check Vercel Function logs for API errors

### Rate Limit Issues

Rate limits are stored in browser's `localStorage`:
- Clear browser data to reset limits for testing
- Or wait until the next day (limits reset at midnight local time)

---

## Security Notes

- Never commit `.env.local` to Git (it's in `.gitignore`)
- API keys should only be stored in Vercel environment variables
- Serverless functions run on Vercel's servers, keeping API keys secure
- Rate limiting prevents abuse of API endpoints

---

## Support

For more help:
- [Vercel Documentation](https://vercel.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)

---

## Quick Reference

**Files to update:**
- `.env.local` - Local environment variables (not committed to Git)
- Vercel Dashboard - Production environment variables

**API Endpoints:**
- `/api/send-message` - Handles "Send Message" form
- `/api/schedule-call` - Handles "Schedule Call" form
- `/api/chat` - Handles AI chatbot conversations

**Rate Limits:**
- Contact forms: 10 messages/day
- AI chat: 20 messages/day

Enjoy your fully functional portfolio! 🚀
