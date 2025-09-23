import FeatureCard from './FeatureCard';
import iconMaeBebe from '@/assets/icon-mae-bebe.png';
import iconQualidade from '@/assets/icon-qualidade.png';
import iconCelular from '@/assets/icon-celular.png';
import iconFelicidade from '@/assets/icon-felicidade.png';

const WhyChooseManta = () => {
  const features = [
    {
      icon: <img src={iconMaeBebe} alt="Mãe e bebê" className="w-8 h-8" />,
      text: "Atendimento para mãe e bebê no conforto de casa."
    },
    {
      icon: <img src={iconQualidade} alt="Qualidade" className="w-8 h-8" />,
      text: "Profissionais verificados e de confiança."
    },
    {
      icon: <img src={iconCelular} alt="Celular" className="w-8 h-8" />,
      text: "Praticidade para agendar serviços."
    },
    {
      icon: <img src={iconFelicidade} alt="Felicidade" className="w-8 h-8" />,
      text: "Mais tempo livre e menos estresse."
    }
  ];

  return (
    <section className="bg-soft-gray px-4 py-16">
      <div className="container mx-auto max-w-4xl">
        <h3 className="text-3xl lg:text-4xl font-bold text-center text-foreground mb-12">
          Por que escolher o{' '}
          <span 
            style={{
              background: 'linear-gradient(135deg, #0077cc 0%, #4A9EFF 50%, #87CEEB 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Manta?
          </span>
        </h3>
        
        <div className="space-y-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              text={feature.text}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseManta;