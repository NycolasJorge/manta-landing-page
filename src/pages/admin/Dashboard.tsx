import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DateRangePicker } from '@/components/DateRangePicker';
import { LogOut, Users, BarChart3, TrendingUp, Baby, Heart, MapPin, DollarSign, Shield, Clock, Sparkles, Hand, Palette, Scissors, X, HelpCircle, Filter, Phone, Copy } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useToast } from '@/hooks/use-toast';

// Mock data - replace with real data from database later
const mockResults = {
  totalResponses: 0,
  whatsappContacts: [
    // Mock contacts - replace with real data from database
    // { id: 1, whatsapp: "(11) 99999-9999", submittedAt: "2024-01-15T10:30:00Z", interest: "sim" },
  ],
  questions: [
    {
      id: 1,
      title: "Você está grávida ou no período puérpero?",
      type: "radio",
      responses: [
        { value: "gravida", label: "Grávida", count: 0, percentage: 0 },
        { value: "pos-parto", label: "Pós-parto", count: 0, percentage: 0 }
      ]
    },
    {
      id: 2,
      title: "Quais serviços você gostaria de encontrar no Manta?",
      type: "checkbox",
      responses: [
        { value: "baba", label: "Babá", count: 0, percentage: 0 },
        { value: "manicure", label: "Manicure", count: 0, percentage: 0 },
        { value: "maquiadora", label: "Maquiadora", count: 0, percentage: 0 },
        { value: "cabeleireira", label: "Cabeleireira", count: 0, percentage: 0 },
        { value: "others", label: "Outros", count: 0, percentage: 0 }
      ]
    },
    {
      id: 3,
      title: "Quando precisa desses serviços hoje, como resolve?",
      type: "radio",
      responses: [
        { value: "salao", label: "Vou até o salão/profissional", count: 0, percentage: 0 },
        { value: "conhecido", label: "Chamo alguém conhecido em casa", count: 0, percentage: 0 },
        { value: "nao-contrato", label: "Não costumo contratar", count: 0, percentage: 0 }
      ]
    },
    {
      id: 4,
      title: "O que é mais importante para você ao escolher um serviço?",
      type: "radio",
      responses: [
        { value: "preco", label: "Preço acessível", count: 0, percentage: 0 },
        { value: "seguranca", label: "Segurança e confiança", count: 0, percentage: 0 },
        { value: "facilidade", label: "Facilidade para agendar", count: 0, percentage: 0 },
        { value: "variedade", label: "Variedade de serviços", count: 0, percentage: 0 }
      ]
    },
    {
      id: 5,
      title: "De que forma o Manta poderia ajudar mais você e seu bebê no dia a dia?",
      type: "checkbox",
      responses: [
        { value: "descanso", label: "Mais tempo para descanso e autocuidado", count: 0, percentage: 0 },
        { value: "apoio", label: "Apoio prático nos cuidados com o bebê", count: 0, percentage: 0 },
        { value: "profissionais", label: "Facilidade para encontrar profissionais de confiança", count: 0, percentage: 0 },
        { value: "others", label: "Outros", count: 0, percentage: 0 }
      ]
    },
    {
      id: 6,
      title: "Você teria interesse em usar um aplicativo como o Manta?",
      type: "radio",
      responses: [
        { value: "sim", label: "Sim", count: 0, percentage: 0 },
        { value: "talvez", label: "Talvez", count: 0, percentage: 0 },
        { value: "nao", label: "Não", count: 0, percentage: 0 }
      ]
    }
  ]
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    // Check if user is authenticated
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
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
    if (mockResults.whatsappContacts.length === 0) {
      toast({
        title: "Nenhum contato",
        description: "Não há contatos para exportar",
        variant: "destructive",
      });
      return;
    }

    const csv = "WhatsApp,Data de Envio,Interesse\n" +
      mockResults.whatsappContacts.map(contact => 
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
              <div className="text-2xl font-bold text-primary">{mockResults.totalResponses}</div>
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
              <div className="text-2xl font-bold text-primary">0%</div>
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
              <div className="text-2xl font-bold text-primary">{mockResults.whatsappContacts.length}</div>
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
              disabled={mockResults.whatsappContacts.length === 0}
            >
              Exportar CSV
            </Button>
          </CardHeader>
          <CardContent>
            {mockResults.whatsappContacts.length === 0 ? (
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
                {mockResults.whatsappContacts.map((contact) => (
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
          {mockResults.questions.map((question) => (
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