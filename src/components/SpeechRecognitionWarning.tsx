import { useEffect, useState } from 'react';
import './SpeechRecognitionWarning.css';

function detectBrowser(): { name: string; supportsSpeech: boolean } {
  const userAgent = navigator.userAgent.toLowerCase();
  // Test for actual API support, not just browser name
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const hasSupport = !!SpeechRecognition;
  
  if (userAgent.includes('firefox')) {
    // Firefox does NOT support speech recognition (only speech synthesis)
    return { name: 'Firefox', supportsSpeech: false };
  }
  if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
    return { name: 'Chrome', supportsSpeech: hasSupport };
  }
  if (userAgent.includes('edg')) {
    return { name: 'Edge', supportsSpeech: hasSupport };
  }
  if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
    return { name: 'Safari', supportsSpeech: hasSupport };
  }
  
  return { name: 'Unknown', supportsSpeech: hasSupport };
}

export default function SpeechRecognitionWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [browserInfo, setBrowserInfo] = useState<{ name: string; supportsSpeech: boolean } | null>(null);

  useEffect(() => {
    const info = detectBrowser();
    setBrowserInfo(info);
    
    if (!info.supportsSpeech) {
      setShowWarning(true);
    }
  }, []);

  if (!showWarning || !browserInfo) return null;

  const isFirefox = browserInfo.name === 'Firefox';

  return (
    <div className="speech-warning">
      <div className="warning-content">
        <h3>Browser Not Supported</h3>
        <p>
          {isFirefox ? (
            <>
              <strong>Firefox does not support speech recognition.</strong>
              <br /><br />
              Please use <strong>Chrome</strong>, <strong>Edge</strong>, or <strong>Safari</strong> for speech recognition to work.
            </>
          ) : (
            `Speech recognition may not work in ${browserInfo.name}. Please use Chrome, Edge, or Safari.`
          )}
        </p>
        {isFirefox && (
          <p className="warning-note" style={{ color: '#d32f2f', fontWeight: 'bold' }}>
            Accuracy scoring will not work in Firefox.
          </p>
        )}
        <button onClick={() => setShowWarning(false)} className="dismiss-button">
          Got it
        </button>
      </div>
    </div>
  );
}

