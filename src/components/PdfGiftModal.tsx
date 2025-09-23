import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X, ExternalLink } from "lucide-react";
import { useState } from "react";

interface PdfGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PdfGiftModal = ({ isOpen, onClose }: PdfGiftModalProps) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleDownload = () => {
    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = '/Guia_de_bem-estar_gestacao_puerperio.pdf';
      link.download = 'Guia_de_bem-estar_gestacao_puerperio.pdf';
      link.target = '_blank';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      // Fallback: open in new tab
      window.open('/Guia_de_bem-estar_gestacao_puerperio.pdf', '_blank');
    }
  };

  const handleOpenInNewTab = () => {
    window.open('/Guia_de_bem-estar_gestacao_puerperio.pdf', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl h-[95vh] md:h-[90vh] flex flex-col p-3 md:p-6">
        <DialogHeader className="flex-shrink-0 pb-2 md:pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <DialogTitle className="text-lg md:text-xl font-semibold text-primary leading-tight">
              🎁 Seu presente por responder nosso questionário!
            </DialogTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Button 
                onClick={handleDownload} 
                variant="outline" 
                size="sm"
                className="flex-1 md:flex-none"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar PDF
              </Button>
              <Button 
                onClick={handleOpenInNewTab} 
                variant="outline" 
                size="sm"
                className="flex-1 md:flex-none md:hidden"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir
              </Button>
              <Button onClick={onClose} variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        {/* Desktop: Show iframe */}
        <div className="flex-1 bg-gray-50 rounded-lg overflow-hidden hidden md:block">
          <iframe
            src="/Guia_de_bem-estar_gestacao_puerperio.pdf"
            className="w-full h-full border-0"
            title="Guia de Bem-estar: Como cuidar do corpo e da mente na gestação e no puerpério"
          />
        </div>

        {/* Mobile: Show preview message and download options */}
        <div className="flex-1 bg-gray-50 rounded-lg overflow-hidden flex md:hidden items-center justify-center p-6">
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">📱</div>
            <h3 className="text-lg font-semibold text-gray-800">
              Visualização otimizada para desktop
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Para a melhor experiência de leitura do seu PDF, use os botões acima para baixar ou abrir em uma nova aba.
            </p>
            <div className="space-y-2">
              <Button 
                onClick={handleDownload} 
                className="w-full"
                size="lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Baixar PDF Completo
              </Button>
              <Button 
                onClick={handleOpenInNewTab} 
                variant="outline"
                className="w-full"
                size="lg"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Abrir em Nova Aba
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 text-center p-3 md:p-4 bg-primary/5 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Guia de Bem-estar:</strong> Como cuidar do corpo e da mente na gestação e no puerpério
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Um presente especial para você que se preocupa com o bem-estar materno 💙
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PdfGiftModal;