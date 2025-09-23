import { Play } from 'lucide-react';
import heroThumbnail from '@/assets/hero-video-thumbnail.jpg';
import mantaLogo from '@/assets/manta-logo.png';

const Header = () => {
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
          
          {/* Video Thumbnail */}
          <div className="relative mb-8 max-w-3xl lg:max-w-2xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img 
                src={heroThumbnail} 
                alt="Cuidadora profissional sorrindo" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <button className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 lg:p-6 transition-all duration-300 transform hover:scale-110 shadow-lg">
                  <Play className="w-8 h-8 lg:w-12 lg:h-12 text-primary ml-1" fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
          
          {/* CTA Button */}
          <button className="modern-cta-button">
            Descubra como funciona
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;