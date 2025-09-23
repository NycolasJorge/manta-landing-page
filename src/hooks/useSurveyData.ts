import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SurveyResponse {
  id: string;
  status: string;
  services: string[];
  others_service?: string;
  current_solution: string;
  priorities: string;
  help_needs: string[];
  others_help?: string;
  interest: string;
  whatsapp: string;
  created_at: string;
  updated_at: string;
}

export interface SurveyStats {
  totalResponses: number;
  interestRate: number;
  whatsappContacts: Array<{
    id: string;
    whatsapp: string;
    submittedAt: string;
    interest: string;
  }>;
  questions: Array<{
    id: number;
    title: string;
    type: string;
    responses: Array<{
      value: string;
      label: string;
      count: number;
      percentage: number;
    }>;
  }>;
}

export const useSurveyData = (dateRange?: { from?: Date; to?: Date }) => {
  const [data, setData] = useState<SurveyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSurveyData = async () => {
    try {
      setLoading(true);
      
      // Verificar se está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Usuário não autenticado');
        setLoading(false);
        return;
      }

      // Verificar se é admin autorizado
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', session.user.email)
        .single();

      if (adminError || !adminUser) {
        setError('Acesso não autorizado');
        setLoading(false);
        return;
      }

      let query = supabase.from('survey_responses').select('*');

      if (dateRange?.from) {
        query = query.gte('created_at', dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        query = query.lte('created_at', dateRange.to.toISOString());
      }

      const { data: responses, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate statistics
      const totalResponses = responses?.length || 0;
      const interestedCount = responses?.filter(r => r.interest === 'sim').length || 0;
      const interestRate = totalResponses > 0 ? Math.round((interestedCount / totalResponses) * 100) : 0;

      // Get WhatsApp contacts
      const whatsappContacts = responses?.map(response => ({
        id: response.id,
        whatsapp: response.whatsapp,
        submittedAt: response.created_at,
        interest: response.interest
      })) || [];

      // Calculate question statistics
      const questions = [
        {
          id: 1,
          title: "Você está grávida ou no período puérpero?",
          type: "radio",
          responses: calculateRadioStats(responses, 'status', [
            { value: "gravida", label: "Grávida" },
            { value: "pos-parto", label: "Pós-parto" }
          ])
        },
        {
          id: 2,
          title: "Quais serviços você gostaria de encontrar no Manta?",
          type: "checkbox",
          responses: calculateCheckboxStats(responses, 'services', [
            { value: "baba", label: "Babá" },
            { value: "manicure", label: "Manicure" },
            { value: "maquiadora", label: "Maquiadora" },
            { value: "cabeleireira", label: "Cabeleireira" }
          ])
        },
        {
          id: 3,
          title: "Quando precisa desses serviços hoje, como resolve?",
          type: "radio",
          responses: calculateRadioStats(responses, 'current_solution', [
            { value: "salao", label: "Vou até o salão/profissional" },
            { value: "conhecido", label: "Chamo alguém conhecido em casa" },
            { value: "nao-contrato", label: "Não costumo contratar" }
          ])
        },
        {
          id: 4,
          title: "O que é mais importante para você ao escolher um serviço?",
          type: "radio",
          responses: calculateRadioStats(responses, 'priorities', [
            { value: "preco", label: "Preço acessível" },
            { value: "seguranca", label: "Segurança e confiança" },
            { value: "facilidade", label: "Facilidade para agendar" },
            { value: "variedade", label: "Variedade de serviços" }
          ])
        },
        {
          id: 5,
          title: "De que forma o Manta poderia ajudar mais você e seu bebê no dia a dia?",
          type: "checkbox",
          responses: calculateCheckboxStats(responses, 'help_needs', [
            { value: "descanso", label: "Mais tempo para descanso e autocuidado" },
            { value: "apoio", label: "Apoio prático nos cuidados com o bebê" },
            { value: "profissionais", label: "Facilidade para encontrar profissionais de confiança" }
          ])
        },
        {
          id: 6,
          title: "Você teria interesse em usar um aplicativo como o Manta?",
          type: "radio",
          responses: calculateRadioStats(responses, 'interest', [
            { value: "sim", label: "Sim" },
            { value: "talvez", label: "Talvez" },
            { value: "nao", label: "Não" }
          ])
        }
      ];

      setData({
        totalResponses,
        interestRate,
        whatsappContacts,
        questions
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveyData();
  }, [dateRange?.from, dateRange?.to]);

  return { data, loading, error, refetch: fetchSurveyData };
};

// Helper functions for calculating statistics
function calculateRadioStats(responses: SurveyResponse[] | null, field: keyof SurveyResponse, options: Array<{ value: string; label: string }>) {
  if (!responses || responses.length === 0) {
    return options.map(option => ({ ...option, count: 0, percentage: 0 }));
  }

  const total = responses.length;
  return options.map(option => {
    const count = responses.filter(r => r[field] === option.value).length;
    const percentage = Math.round((count / total) * 100);
    return { ...option, count, percentage };
  });
}

function calculateCheckboxStats(responses: SurveyResponse[] | null, field: keyof SurveyResponse, options: Array<{ value: string; label: string }>) {
  if (!responses || responses.length === 0) {
    return options.map(option => ({ ...option, count: 0, percentage: 0 }));
  }

  const total = responses.length;
  return options.map(option => {
    const count = responses.filter(r => {
      const fieldValue = r[field] as string[];
      return Array.isArray(fieldValue) && fieldValue.includes(option.value);
    }).length;
    const percentage = Math.round((count / total) * 100);
    return { ...option, count, percentage };
  });
}