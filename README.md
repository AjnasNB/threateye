# ThreatEye - AI Threat Monitor

ThreatEye is an AI-powered security system that watches computer screens and audio in real-time to flag extremist content or terror-related activity, alerting authorities instantly to prevent attacks.

## Problem it Solves

Terror plots and violent radicalization often brew online without timely detection. It's impossible for humans to manually monitor countless digital feeds. ThreatEye automates surveillance for dangerous imagery, keywords, or hate symbols on-screen, providing early warnings to stop terror incidents before they occur.

## Core Features

- **Continuous Monitoring**: Uses ScreenPipe on endpoint machines to continuously capture screen content and microphone audio for analysis
- **AI Threat Detection**: Groq-accelerated models perform image recognition (e.g., weapons, extremist logos) and NLP on captured text/audio to identify terror-related material or hate speech in real-time
- **Real-time Alerts**: If suspicious content is detected, the system triggers instant alerts (with screenshots or transcripts) to security personnel, with threat level classification
- **Investigation Console**: A simple web dashboard for authorities to review alerts, view flagged screen images, and search the recorded history for context (e.g., find all occurrences of a flagged keyword)

## Technology Stack

- **Frontend**: Next.js, React, TailwindCSS
- **AI Services**: Groq AI for high-performance inference
- **Monitoring**: ScreenPipe for screen and audio capture
- **Security**: Secure API endpoints with proper authentication

## Getting Started

### Prerequisites

- Node.js (18.x or higher)
- npm or yarn
- ScreenPipe installed on endpoint machines

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/threateye.git
   cd threateye
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with:
   ```
   GROQ_API_KEY=your_groq_api_key
   ```

4. Run the development server:
   ```
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This application can be deployed on Vercel, Netlify, or any other Next.js compatible platform.

```
npm run build
npm run start
```

## API Usage

ThreatEye provides API endpoints for:
- Submitting screen captures for analysis
- Submitting audio transcripts for analysis 
- Retrieving and managing alerts

See the API documentation at `/api/docs` when running the application.

## License

This project is proprietary and confidential.

## Contact

For any inquiries, please contact [your-email@example.com](mailto:your-email@example.com).
