import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Instagram, Share2, Copy, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fastingData: {
    duration: string;
    streak: number;
    level: number;
    achievement?: string;
  };
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, fastingData }) => {
  const [customMessage, setCustomMessage] = useState(
    `Acabei de completar ${fastingData.duration} de jejum no FastQuest! 🎉\n\n✨ ${fastingData.streak} dias consecutivos\n🚀 Nível ${fastingData.level}\n\nJunte-se a mim nesta jornada de saúde!`
  );
  const [isSharing, setIsSharing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const handleInstagramShare = async () => {
    setIsSharing(true);
    try {
      // Simulação de compartilhamento no Instagram
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Compartilhado com sucesso!",
        description: "Sua conquista foi compartilhada no Instagram Stories!",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Erro ao compartilhar",
        description: "Não foi possível compartilhar no Instagram. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(customMessage);
      setIsCopied(true);
      toast({
        title: "Texto copiado!",
        description: "A mensagem foi copiada para a área de transferência.",
      });
      
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o texto.",
        variant: "destructive"
      });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FastQuest - Minha Conquista',
          text: customMessage,
          url: 'https://fastquest.app'
        });
      } catch (error) {
        console.log('Compartilhamento cancelado pelo usuário');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            🎉 Compartilhar Conquista
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview Card */}
          <Card className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 border-0">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="font-bold text-lg">Jejum Completado!</h3>
              <p className="text-sm text-gray-600">
                {fastingData.duration} • {fastingData.streak} dias de streak
              </p>
              {fastingData.achievement && (
                <div className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                  {fastingData.achievement}
                </div>
              )}
            </div>
          </Card>

          {/* Custom Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Personalize sua mensagem:</label>
            <Textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Escreva sua mensagem..."
              className="min-h-[100px]"
              maxLength={280}
            />
            <div className="text-xs text-gray-500 text-right">
              {customMessage.length}/280 caracteres
            </div>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={handleInstagramShare}
              disabled={isSharing}
              className="h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Instagram className="w-5 h-5 mr-2" />
              {isSharing ? 'Compartilhando...' : 'Compartilhar no Instagram Stories'}
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleNativeShare}
                variant="outline"
                className="h-10"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
              
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="h-10"
              >
                {isCopied ? (
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {isCopied ? 'Copiado!' : 'Copiar'}
              </Button>
            </div>
          </div>

          <div className="text-xs text-center text-gray-500">
            Compartilhe sua jornada e inspire outros! 💪
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
