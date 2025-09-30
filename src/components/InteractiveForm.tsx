import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Baby, Heart, ArrowLeft, ArrowRight, Sparkles, Shield, Clock, Star, Hand, Palette, Scissors, MapPin, X, DollarSign, HelpCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PdfGiftModal from '@/components/PdfGiftModal';

interface FormData {
  status: string;
  services: string[];
  currentSolution: string;
  priorities: string;
  helpNeeds: string[];
  interest: string;
  whatsapp: string;
  othersService: string;
  othersHelp: string;
}

const InteractiveForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    status: '',
    services: [],
    currentSolution: '',
    priorities: '',
    helpNeeds: [],
    interest: '',
    whatsapp: '',
    othersService: '',
    othersHelp: ''
  });

  const questions = [
    {
      title: "Você está grávida ou no período puérpero?",
      type: "radio",
      key: "status" as keyof FormData,
      options: [
        { value: "gravida", label: "Grávida", description: "Estou esperando um bebê", icon: Baby },
        { value: "pos-parto", label: "Pós-parto", description: "Meu bebê já nasceu", icon: Heart }
      ]
    },
    {
      title: "Quais serviços você gostaria de encontrar no Manta?",
      type: "checkbox",
      key: "services" as keyof FormData,
      options: [
        { value: "baba", label: "Babá", icon: Baby },
        { value: "manicure", label: "Manicure", icon: Hand },
        { value: "maquiadora", label: "Maquiadora", icon: Palette },
        { value: "cabeleireira", label: "Cabeleireira", icon: Scissors }
      ],
      hasOthers: true,
      othersKey: "othersService" as keyof FormData
    },
    {
      title: "Quando precisa desses serviços hoje, como resolve?",
      type: "radio",
      key: "currentSolution" as keyof FormData,
      options: [
        { value: "salao", label: "Vou até o salão/profissional", icon: MapPin },
        { value: "conhecido", label: "Chamo alguém conhecido em casa", icon: Heart },
        { value: "nao-contrato", label: "Não costumo contratar", icon: X }
      ]
    },
    {
      title: "O que é mais importante para você ao escolher um serviço?",
      type: "radio",
      key: "priorities" as keyof FormData,
      options: [
        { value: "preco", label: "Preço acessível", icon: DollarSign },
        { value: "seguranca", label: "Segurança e confiança", icon: Shield },
        { value: "facilidade", label: "Facilidade para agendar", icon: Clock },
        { value: "variedade", label: "Variedade de serviços", icon: Sparkles }
      ]
    },
    {
      title: "De que forma o Manta poderia ajudar mais você e seu bebê no dia a dia?",
      type: "checkbox",
      key: "helpNeeds" as keyof FormData,
      options: [
        { value: "descanso", label: "Mais tempo para descanso e autocuidado", icon: Heart },
        { value: "apoio", label: "Apoio prático nos cuidados com o bebê", icon: Baby },
        { value: "profissionais", label: "Facilidade para encontrar profissionais de confiança", icon: Shield }
      ],
      hasOthers: true,
      othersKey: "othersHelp" as keyof FormData
    },
    {
      title: "Você teria interesse em usar um aplicativo como o Manta?",
      type: "radio",
      key: "interest" as keyof FormData,
      options: [
        { value: "sim", label: "Sim", icon: Heart },
        { value: "talvez", label: "Talvez", icon: HelpCircle },
        { value: "nao", label: "Não", icon: X }
      ]
    },
    {
      title: "Gostaria de ser avisada quando o aplicativo estiver disponível?",
      type: "whatsapp",
      key: "whatsapp" as keyof FormData
    }
  ];

  const currentQuestion = questions[currentStep];
  const totalSteps = questions.length;

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await submitForm();
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('survey_responses')
        .insert({
          status: formData.status,
          services: formData.services,
          others_service: formData.othersService || null,
          current_solution: formData.currentSolution,
          priorities: formData.priorities,
          help_needs: formData.helpNeeds,
          others_help: formData.othersHelp || null,
          interest: formData.interest,
          whatsapp: formData.whatsapp
        });

      if (error) throw error;

      toast({
        title: "Obrigada!",
        description: "Suas respostas foram enviadas com sucesso. Te avisaremos quando o app estiver pronto!",
      });

      // Show gift modal
      setShowGiftModal(true);

      // Reset form
      setFormData({
        status: '',
        services: [],
        currentSolution: '',
        priorities: '',
        helpNeeds: [],
        interest: '',
        whatsapp: '',
        othersService: '',
        othersHelp: ''
      });
      setCurrentStep(0);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erro",
        description: "Houve um erro ao enviar suas respostas. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      [currentQuestion.key]: value
    }));
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    const currentValues = formData[currentQuestion.key as keyof FormData] as string[];
    if (checked) {
      setFormData(prev => ({
        ...prev,
        [currentQuestion.key]: [...currentValues, value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [currentQuestion.key]: currentValues.filter(v => v !== value)
      }));
    }
  };

  const handleInputChange = (key: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const isStepValid = () => {
    const currentValue = formData[currentQuestion.key as keyof FormData];
    if (currentQuestion.type === 'checkbox') {
      return (currentValue as string[]).length > 0 || (currentQuestion.hasOthers && formData[currentQuestion.othersKey as keyof FormData]);
    } else if (currentQuestion.type === 'whatsapp') {
      return formData.whatsapp.length > 0;
    }
    return currentValue && currentValue !== '';
  };

  const renderQuestion = () => {
    if (currentQuestion.type === 'radio') {
      return (
        <div className="grid gap-4 max-w-md mx-auto">
          {currentQuestion.options?.map((option) => {
            const Icon = option.icon;
            const isSelected = formData[currentQuestion.key as keyof FormData] === option.value;
            return (
              <Card 
                key={option.value}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  isSelected 
                    ? 'ring-2 ring-primary shadow-lg bg-primary/5' 
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => handleRadioChange(option.value)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full transition-colors ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-lg font-semibold">{option.label}</h5>
                      {option.description && (
                        <p className="text-sm text-muted-foreground">
                          {option.description}
                        </p>
                      )}
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 transition-colors ${
                      isSelected 
                        ? 'bg-primary border-primary' 
                        : 'border-muted-foreground'
                    }`}>
                      {isSelected && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      );
    }

    if (currentQuestion.type === 'checkbox') {
      return (
        <div className="space-y-4 max-w-md mx-auto">
          {currentQuestion.options?.map((option) => {
            const Icon = option.icon;
            const isChecked = (formData[currentQuestion.key as keyof FormData] as string[]).includes(option.value);
            return (
              <Card 
                key={option.value}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  isChecked 
                    ? 'ring-2 ring-primary shadow-lg bg-primary/5' 
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => handleCheckboxChange(option.value, !isChecked)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full transition-colors ${
                      isChecked 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-lg font-semibold">{option.label}</h5>
                    </div>
                    <Checkbox 
                      checked={isChecked}
                      onChange={() => handleCheckboxChange(option.value, !isChecked)}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {currentQuestion.hasOthers && (
            <Card className="border-dashed">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-muted">
                    <Star className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="others" className="text-lg font-semibold">Outros:</Label>
                    <Input
                      id="others"
                      placeholder="Especifique outros serviços..."
                      value={formData[currentQuestion.othersKey as keyof FormData] as string}
                      onChange={(e) => handleInputChange(currentQuestion.othersKey as keyof FormData, e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      );
    }

    if (currentQuestion.type === 'whatsapp') {
      return (
        <div className="max-w-lg mx-auto">
          <Card className="border-2 border-primary/20 shadow-xl">
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Icon and main message */}
                <div className="text-center space-y-4">
                  <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-primary to-primary/60 shadow-lg">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  
                  <h5 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Ganhe Acesso Exclusivo!
                  </h5>
                  
                  <div className="space-y-3 text-left bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/10">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded-full bg-primary/20">
                        <Star className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-sm text-foreground/90 flex-1">
                        <span className="font-semibold">Ebook exclusivo</span> sobre bem-estar na gestação e pós-parto antes do lançamento
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded-full bg-primary/20">
                        <Heart className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-sm text-foreground/90 flex-1">
                        A <span className="font-semibold">Manta está em desenvolvimento</span> e será lançada em breve
                      </p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded-full bg-primary/20">
                        <Baby className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-sm text-foreground/90 flex-1">
                        Seja a primeira a saber quando o app estiver disponível
                      </p>
                    </div>
                  </div>
                </div>

                {/* Input field */}
                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="text-base font-semibold text-center block">
                    Seu número de WhatsApp:
                  </Label>
                  <Input
                    id="whatsapp"
                    placeholder="(11) 99999-9999"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    className="text-center text-lg h-12 border-2 focus:border-primary"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Seus dados estão seguros e não serão compartilhados
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <section id="interactive-form" className="bg-background px-4 py-16">
        <div className="container mx-auto max-w-2xl">
          <h3 className="text-3xl lg:text-4xl font-bold text-center text-foreground mb-12">
            Queremos ouvir você!
          </h3>
        
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Pergunta {currentStep + 1} de {totalSteps}</span>
            <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <h4 className="text-xl font-semibold text-center mb-8" 
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
            {currentQuestion.title}
          </h4>
          
          {renderQuestion()}
          
          <div className="flex justify-between items-center pt-6">
            <Button 
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
              size="lg"
              className="px-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={!isStepValid() || isSubmitting}
              size="lg"
              className="px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: isStepValid() && !isSubmitting
                  ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                  : undefined
              }}
            >
              {isSubmitting ? 'Enviando...' : currentStep === totalSteps - 1 ? 'Finalizar' : 'Próximo'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
    
    <PdfGiftModal 
      isOpen={showGiftModal} 
      onClose={() => setShowGiftModal(false)} 
    />
    </>
  );
};

export default InteractiveForm;