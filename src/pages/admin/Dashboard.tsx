import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DateRangePicker } from '@/components/DateRangePicker';
import { LogOut, Users, BarChart3, TrendingUp, Baby, Heart, MapPin, DollarSign, Shield, Clock, Sparkles, Hand, Palette, Scissors, X, HelpCircle, Filter, Phone, Copy } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useToast } from '@/hooks/use-toast';
import { useSurveyData } from '@/hooks/useSurveyData';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: surveyData, loading, error } = useSurveyData(dateRange);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          if (isMounted) {
            setIsAuthenticated(false);
            navigate('/admin/login');
          }
          return;
        }

        // Verificar se é admin autorizado
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('email')
          .eq('email', session.user.email)
          .single();

        if (adminError || !adminUser) {
          await supabase.auth.signOut();
          if (isMounted) {
            setIsAuthenticated(false);
            navigate('/admin/login');
          }
          return;
        }

        if (isMounted) {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        if (isMounted) {
          setIsAuthenticated(false);
          navigate('/admin/login');
        }
      }
    };

    checkAuth();

    // Monitorar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        if (isMounted) {
          setIsAuthenticated(false);
          navigate('/admin/login');
        }
        return;
      }

      if (event === 'SIGNED_IN') {
        // Verificar se é admin autorizado
        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('email')
          .eq('email', session.user.email)
          .single();

        if (adminError || !adminUser) {
          await supabase.auth.signOut();
          if (isMounted) {
            setIsAuthenticated(false);
            navigate('/admin/login');
          }
        } else if (isMounted) {
          setIsAuthenticated(true);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Número copiado para a área de transferência",
    });
  };

  const exportContacts = () => {
    if (!surveyData || surveyData.whatsappContacts.length === 0) {
      toast({
        title: "Nenhum contato",
        description: "Não há contatos para exportar",
        variant: "destructive",
      });
      return;
    }

    const csv = "WhatsApp,Data de Envio,Interesse\n" +
      surveyData.whatsappContacts.map(contact => 
        `${contact.whatsapp},${new Date(contact.submittedAt).toLocaleDateString('pt-BR')},${contact.interest}`
      ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contatos_manta.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Exportado!",
      description: "Lista de contatos exportada com sucesso",
    });
  };

  const getIcon = (value: string) => {
    const iconMap: { [key: string]: any } = {
      'gravida': Baby,
      'pos-parto': Heart,
      'baba': Baby,
      'manicure': Hand,
      'maquiadora': Palette,
      'cabeleireira': Scissors,
      'salao': MapPin,
      'conhecido': Heart,
      'nao-contrato': X,
      'preco': DollarSign,
      'seguranca': Shield,
      'facilidade': Clock,
      'variedade': Sparkles,
      'descanso': Heart,
      'apoio': Baby,
      'profissionais': Shield,
      'sim': Heart,
      'talvez': HelpCircle,
      'nao': X
    };
    
    return iconMap[value] || BarChart3;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Manta Admin</h1>
            <p className="text-muted-foreground">Resultados do Questionário</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Período das respostas:
                  </label>
                  <DateRangePicker
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setDateRange(undefined)}
                  className="mt-6 sm:mt-0"
                >
                  Limpar Filtros
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Respostas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{surveyData?.totalResponses || 0}</div>
              <p className="text-xs text-muted-foreground">
                {dateRange?.from && dateRange?.to 
                  ? `Período selecionado` 
                  : 'Selecione um período para ver os dados'
                }
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Interesse</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{surveyData?.interestRate || 0}%</div>
              <p className="text-xs text-muted-foreground">
                Usuárias interessadas no app
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contatos Coletados</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{surveyData?.whatsappContacts.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {dateRange?.from && dateRange?.to 
                  ? `Período selecionado` 
                  : 'WhatsApps coletados'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* WhatsApp Contacts Section */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contatos WhatsApp
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Usuárias que deixaram seu WhatsApp para receber notificações
              </p>
            </div>
            <Button 
              onClick={exportContacts}
              variant="outline"
              disabled={!surveyData || surveyData.whatsappContacts.length === 0}
            >
              Exportar CSV
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Carregando dados...</p>
              </div>
            ) : !surveyData || surveyData.whatsappContacts.length === 0 ? (
              <div className="text-center py-8">
                <Phone className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nenhum contato WhatsApp coletado ainda.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Os contatos aparecerão aqui quando os usuários preencherem o questionário.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {surveyData.whatsappContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Phone className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{contact.whatsapp}</p>
                        <p className="text-sm text-muted-foreground">
                          Enviado em {new Date(contact.submittedAt).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={contact.interest === 'sim' ? 'default' : 'secondary'}>
                        {contact.interest === 'sim' ? 'Interessada' : contact.interest === 'talvez' ? 'Talvez' : 'Não interessada'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(contact.whatsapp)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Questions Results */}
        <div className="grid gap-6">
          {surveyData?.questions.map((question) => (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="text-lg">{question.title}</CardTitle>
                <Badge variant="secondary" className="w-fit">
                  {question.type === 'radio' ? 'Escolha única' : 'Múltipla escolha'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {question.responses.map((response) => {
                    const Icon = getIcon(response.value);
                    return (
                      <div key={response.value} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{response.label}</p>
                            <p className="text-sm text-muted-foreground">
                              {response.count} respostas
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-bold text-primary">{response.percentage}%</p>
                          </div>
                          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all duration-300"
                              style={{ width: `${response.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;