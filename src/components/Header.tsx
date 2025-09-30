import { useState, useEffect, useRef } from 'react';
import Player from '@vimeo/player';
import mantaLogo from '@/assets/manta-logo.png';

const Header = () => {
  const [hasFinished, setHasFinished] = useState(false);
  const [showEbookMessage, setShowEbookMessage] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const player = new Player(iframeRef.current);
      
      player.on('play', () => {
        setShowEbookMessage(false);
      });

      player.on('ended', () => {
        setHasFinished(true);
      });
    }
  }, []);

  const scrollToForm = () => {
    const formElement = document.getElementById('interactive-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="bg-background px-4 py-8 lg:py-16">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img 
              src={mantaLogo} 
              alt="Manta" 
              className="h-10 lg:h-12 w-auto"
            />
          </div>
          
          {/* Headlines */}
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
            <span className="block text-foreground">Porque mamãe e bebê</span>
            <span className="block gradient-text">merecem cuidado.</span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium">
            O Manta conecta você a quem pode ajudar no dia a dia.
          </p>
          
          {/* Video Section */}
          <div className="relative mb-8 w-full lg:max-w-4xl lg:mx-auto">
            <div className="relative lg:rounded-2xl overflow-hidden shadow-card">
              {/* Gift Badge - Before Video Ends */}
              {showEbookMessage && (
                <div className="absolute top-4 left-4 right-4 lg:top-6 lg:left-6 lg:right-6 flex justify-center z-10">
                  <div className="bg-gradient-to-r from-primary to-primary/90 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-full shadow-lg backdrop-blur-sm border-2 border-white/20">
                    <p className="text-sm lg:text-base font-bold text-center flex items-center gap-2">
                      <span className="text-lg lg:text-xl">🎁</span>
                      <span>Assista até o final e ganhe um Ebook Grátis!</span>
                    </p>
                  </div>
                </div>
              )}
              
              {/* Gift Badge - After Video Ends */}
              {hasFinished && (
                <div className="absolute top-4 left-4 right-4 lg:top-6 lg:left-6 lg:right-6 flex justify-center z-10">
                  <div className="bg-gradient-to-r from-primary to-primary/90 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-full shadow-lg backdrop-blur-sm border-2 border-white/20">
                    <p className="text-sm lg:text-base font-bold text-center flex items-center gap-2">
                      <span className="text-lg lg:text-xl">🎁</span>
                      <span>Responda o questionário abaixo e ganhe seu Ebook Grátis!</span>
                    </p>
                  </div>
                </div>
              )}
              
              <div className="aspect-video">
                <iframe
                  ref={iframeRef}
                  src="https://player.vimeo.com/video/1123090970?badge=0&autopause=0&player_id=0&app_id=58479"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                  title="Vimeo video"
                />
              </div>
            </div>
          </div>
          
          {/* CTA Button */}
          <button onClick={scrollToForm} className="modern-cta-button">
            Descubra como funciona
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;