import { useState } from 'react';
import { Play } from 'lucide-react';
import YouTube from 'react-youtube';
import heroThumbnail from '@/assets/hero-video-thumbnail.jpg';
import mantaLogo from '@/assets/manta-logo.png';

const Header = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const handleVideoEnd = () => {
    setHasFinished(true);
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('interactive-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const opts = {
    playerVars: {
      autoplay: 1,
      controls: 1,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      iv_load_policy: 3,
      disablekb: 1,
      fs: 0,
    },
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
          <div className="relative mb-8 max-w-3xl lg:max-w-2xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              {!isPlaying ? (
                <>
                  <img 
                    src={heroThumbnail} 
                    alt="Cuidadora profissional sorrindo" 
                    className="w-full h-auto"
                  />
                  
                  {/* Gift Badge - Before Playing */}
                  <div className="absolute top-4 left-4 right-4 lg:top-6 lg:left-6 lg:right-6 flex justify-center z-10">
                    <div className="bg-gradient-to-r from-primary to-primary/90 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-full shadow-lg backdrop-blur-sm border-2 border-white/20 animate-pulse">
                      <p className="text-sm lg:text-base font-bold text-center flex items-center gap-2">
                        <span className="text-lg lg:text-xl">🎁</span>
                        <span>Assista até o final e ganhe um Ebook Grátis!</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <button 
                      onClick={handlePlayClick}
                      className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 lg:p-6 transition-all duration-300 transform hover:scale-110 shadow-lg"
                    >
                      <Play className="w-8 h-8 lg:w-12 lg:h-12 text-primary ml-1" fill="currentColor" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="aspect-video">
                    <YouTube
                      videoId="MCI4dSqOAvc"
                      opts={opts}
                      onEnd={handleVideoEnd}
                      className="w-full h-full"
                      iframeClassName="w-full h-full"
                    />
                  </div>
                  
                  {/* Gift Badge - After Video Ends */}
                  {hasFinished && (
                    <div className="absolute top-4 left-4 right-4 lg:top-6 lg:left-6 lg:right-6 flex justify-center z-10">
                      <div className="bg-gradient-to-r from-primary to-primary/90 text-white px-4 py-2 lg:px-6 lg:py-3 rounded-full shadow-lg backdrop-blur-sm border-2 border-white/20 animate-pulse">
                        <p className="text-sm lg:text-base font-bold text-center flex items-center gap-2">
                          <span className="text-lg lg:text-xl">🎁</span>
                          <span>Responda o questionário abaixo e ganhe seu Ebook Grátis!</span>
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
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