# ThreatEye Desktop Application

ThreatEye Desktop is an AI-powered application designed to monitor, detect, and prevent extremist content on user devices.

## Features

- **Real-time monitoring**: Scans screen content to detect potential extremist material
- **AI-powered analysis**: Utilizes the Groq LLM API for advanced content analysis
- **Customizable settings**: Adjust monitoring intervals and notification preferences
- **Detailed detection logs**: Track and manage all detected threats
- **User-friendly interface**: Modern, intuitive UI with easy navigation

## Getting Started

### Prerequisites

- Node.js 16+
- Electron
- Groq API key (for AI analysis features)

### Installation

1. Clone the repository
```
git clone https://github.com/your-organization/threateye.git
cd threateye/desktop-app
```

2. Install dependencies
```
npm install
```

3. Configure your Groq API key in the settings tab of the application

### Running the Application

```
npm start
```

## Application Structure

- `index.html` - Main application UI
- `app.js` - Application logic and functionality
- `styles.css` - Application styling

## Usage

1. Start the application
2. Configure your settings in the Settings tab
3. Click "Start Monitoring" to begin the detection process
4. Review any detections in the Detections tab
5. Check the Activity Log for detailed event history

## Development 

### Building for Production

```
npm run build
```

This will create platform-specific distributables in the `dist` folder.

### Development Mode

```
npm run dev
```

This will start the application with live reloading for development purposes.

## Technologies Used

- HTML/CSS/JavaScript
- Electron
- Groq API for AI-powered analysis

## License

This project is licensed under the MIT License - see the LICENSE file for details. 