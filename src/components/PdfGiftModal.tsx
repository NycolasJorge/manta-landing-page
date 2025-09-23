import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface PdfGiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PdfGiftModal = ({ isOpen, onClose }: PdfGiftModalProps) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/Guia_de_bem-estar_gestacao_puerperio.pdf';
    link.download = 'Guia_de_bem-estar_gestacao_puerperio.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-primary">
              🎁 Seu presente por responder nosso questionário!
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Baixar PDF
              </Button>
              <Button onClick={onClose} variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 bg-gray-50 rounded-lg overflow-hidden">
          <iframe
            src="/Guia_de_bem-estar_gestacao_puerperio.pdf"
            className="w-full h-full border-0"
            title="Guia de Bem-estar: Como cuidar do corpo e da mente na gestação e no puerpério"
          />
        </div>
        
        <div className="flex-shrink-0 text-center p-4 bg-primary/5 rounded-lg">
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