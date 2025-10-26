import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Service {
  id: number;
  name: string;
  basePrice: number;
  unit: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
}

const initialServices: Service[] = [
  { id: 1, name: 'Электромонтаж', basePrice: 1500, unit: 'точка' },
  { id: 2, name: 'СКУД', basePrice: 5000, unit: 'шт' },
  { id: 3, name: 'СКС', basePrice: 800, unit: 'точка' },
  { id: 4, name: 'ОПС', basePrice: 3500, unit: 'шт' },
  { id: 5, name: 'АПС', basePrice: 4000, unit: 'шт' },
  { id: 6, name: 'Видеонаблюдение', basePrice: 6500, unit: 'камера' },
];

export default function Index() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const { toast } = useToast();

  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleCalculate = () => {
    const service = services.find(s => s.id === parseInt(selectedService));
    if (service && quantity) {
      const total = service.basePrice * parseFloat(quantity);
      setCalculatedPrice(total);
      toast({
        title: 'Расчёт выполнен',
        description: `Стоимость: ${total.toLocaleString('ru-RU')} ₽`,
      });
    }
  };

  const handleRegister = () => {
    if (newClient.name && newClient.email && newClient.phone) {
      const client: Client = {
        id: Date.now(),
        ...newClient,
        date: new Date().toLocaleDateString('ru-RU')
      };
      setClients([...clients, client]);
      setNewClient({ name: '', email: '', phone: '' });
      toast({
        title: 'Успешно',
        description: 'Заявка зарегистрирована. Мы свяжемся с вами.',
      });
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAdmin(true);
      setAdminPassword('');
      toast({
        title: 'Вход выполнен',
        description: 'Добро пожаловать в админ-панель',
      });
    } else {
      toast({
        title: 'Ошибка',
        description: 'Неверный пароль',
        variant: 'destructive'
      });
    }
  };

  const [newService, setNewService] = useState({
    name: '',
    basePrice: 0,
    unit: ''
  });
  const [editingService, setEditingService] = useState<Service | null>(null);

  const updateServicePrice = (id: number, newPrice: number) => {
    setServices(services.map(s => s.id === id ? { ...s, basePrice: newPrice } : s));
    toast({
      title: 'Цена обновлена',
      description: 'Изменения сохранены',
    });
  };

  const addService = () => {
    if (newService.name && newService.basePrice && newService.unit) {
      const service: Service = {
        id: Date.now(),
        ...newService
      };
      setServices([...services, service]);
      setNewService({ name: '', basePrice: 0, unit: '' });
      toast({
        title: 'Услуга добавлена',
        description: 'Новая услуга добавлена в калькулятор',
      });
    }
  };

  const deleteService = (id: number) => {
    setServices(services.filter(s => s.id !== id));
    toast({
      title: 'Услуга удалена',
      description: 'Услуга удалена из калькулятора',
    });
  };

  const updateService = (id: number, field: keyof Service, value: string | number) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg">
                <Icon name="Wrench" className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ПроМонтаж
                </h1>
                <p className="text-xs text-muted-foreground">Профессиональные монтажные услуги</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Icon name="UserPlus" size={18} />
                    Регистрация
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Регистрация клиента</DialogTitle>
                    <DialogDescription>
                      Заполните форму для получения консультации
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="name">Имя</Label>
                      <Input
                        id="name"
                        value={newClient.name}
                        onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                        placeholder="Иван Иванов"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newClient.email}
                        onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                        placeholder="ivan@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        value={newClient.phone}
                        onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                        placeholder="+7 (999) 123-45-67"
                      />
                    </div>
                    <Button onClick={handleRegister} className="w-full">
                      Отправить заявку
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {!isAdmin ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <Icon name="Lock" size={18} />
                      Админ
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Вход в админ-панель</DialogTitle>
                      <DialogDescription>
                        Введите пароль для доступа
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label htmlFor="password">Пароль</Label>
                        <Input
                          id="password"
                          type="password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="Введите пароль"
                          onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                        />
                      </div>
                      <Button onClick={handleAdminLogin} className="w-full">
                        Войти
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button 
                  variant="ghost" 
                  className="gap-2"
                  onClick={() => setIsAdmin(false)}
                >
                  <Icon name="LogOut" size={18} />
                  Выйти
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {!isAdmin ? (
          <div className="max-w-4xl mx-auto space-y-12">
            <section className="text-center space-y-4 animate-fade-in">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-primary via-blue-600 to-accent bg-clip-text text-transparent">
                Монтажные работы
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Электромонтаж, слаботочные системы
              </p>

            </section>



            <Card className="shadow-xl border-2 animate-scale-in">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Icon name="Calculator" className="text-primary" size={28} />
                  Калькулятор стоимости
                </CardTitle>
                <CardDescription>
                  Рассчитайте примерную стоимость работ
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="service">Выберите услугу</Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger id="service">
                        <SelectValue placeholder="Выберите услугу" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map(service => (
                          <SelectItem key={service.id} value={service.id.toString()}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Количество</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="1"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleCalculate} 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                  size="lg"
                  disabled={!selectedService || !quantity}
                >
                  <Icon name="Calculator" size={20} className="mr-2" />
                  Рассчитать стоимость
                </Button>

                {calculatedPrice !== null && (
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg border-2 border-primary/20 animate-scale-in">
                    <p className="text-sm text-muted-foreground mb-2">Итоговая стоимость:</p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {calculatedPrice.toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto animate-fade-in">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <div className="flex items-center gap-3">
                  <Icon name="Settings" className="text-primary" size={32} />
                  <div>
                    <CardTitle className="text-3xl">Панель администратора</CardTitle>
                    <CardDescription className="text-base">
                      Управление услугами и клиентами
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="calculator">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="calculator" className="gap-2">
                      <Icon name="Calculator" size={18} />
                      Редактор калькуляции
                    </TabsTrigger>
                    <TabsTrigger value="clients" className="gap-2">
                      <Icon name="Users" size={18} />
                      Клиенты ({clients.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="calculator" className="space-y-6">
                    <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Icon name="Plus" size={20} />
                          Добавить новую услугу
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-4 gap-4">
                          <div>
                            <Label htmlFor="newServiceName">Название</Label>
                            <Input
                              id="newServiceName"
                              value={newService.name}
                              onChange={(e) => setNewService({...newService, name: e.target.value})}
                              placeholder="Название услуги"
                            />
                          </div>
                          <div>
                            <Label htmlFor="newServiceUnit">Единица</Label>
                            <Input
                              id="newServiceUnit"
                              value={newService.unit}
                              onChange={(e) => setNewService({...newService, unit: e.target.value})}
                              placeholder="шт, м, точка"
                            />
                          </div>
                          <div>
                            <Label htmlFor="newServicePrice">Цена</Label>
                            <Input
                              id="newServicePrice"
                              type="number"
                              value={newService.basePrice || ''}
                              onChange={(e) => setNewService({...newService, basePrice: parseFloat(e.target.value) || 0})}
                              placeholder="0"
                            />
                          </div>
                          <div className="flex items-end">
                            <Button onClick={addService} className="w-full">
                              <Icon name="Plus" size={18} className="mr-2" />
                              Добавить
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Услуга</TableHead>
                          <TableHead>Единица</TableHead>
                          <TableHead>Цена (₽)</TableHead>
                          <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {services.map(service => (
                          <TableRow key={service.id}>
                            <TableCell>
                              <Input
                                value={service.name}
                                onChange={(e) => updateService(service.id, 'name', e.target.value)}
                                className="font-medium"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                value={service.unit}
                                onChange={(e) => updateService(service.id, 'unit', e.target.value)}
                                className="w-24"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={service.basePrice}
                                onChange={(e) => updateService(service.id, 'basePrice', parseFloat(e.target.value) || 0)}
                                className="w-32"
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteService(service.id)}
                              >
                                <Icon name="Trash2" size={16} className="mr-1" />
                                Удалить
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="clients">
                    {clients.length === 0 ? (
                      <div className="text-center py-12">
                        <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Заявок пока нет</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Имя</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Телефон</TableHead>
                            <TableHead>Дата</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {clients.map(client => (
                            <TableRow key={client.id}>
                              <TableCell className="font-medium">{client.name}</TableCell>
                              <TableCell>{client.email}</TableCell>
                              <TableCell>{client.phone}</TableCell>
                              <TableCell>{client.date}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg">
              <Icon name="Wrench" className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold">ПроМонтаж</h3>
          </div>
          <p className="text-slate-400">© 2024 Все права защищены</p>
        </div>
      </footer>
    </div>
  );
}