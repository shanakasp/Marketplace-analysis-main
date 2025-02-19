'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Search, TrendingUp, MapPin, Clock, LogIn, Menu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const MarketplaceTrends = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [timeRange, setTimeRange] = useState('3');
  const [trendData, setTrendData] = useState([]);
  const [relatedKeywords, setRelatedKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('apercu');

  useEffect(() => {
    // Vérifier le statut de connexion Facebook
    if (window.FB) {
      FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          setIsLoggedIn(true);
          fetchUserProfile();
        }
      });
    }
  }, []);

  const handleFacebookLogin = () => {
    if (window.FB) {
      FB.login(function(response) {
        if (response.authResponse) {
          setIsLoggedIn(true);
          fetchUserProfile();
        } else {
          setError('Connexion à Facebook échouée');
        }
      }, {scope: 'public_profile,user_location'});
    }
  };

  const fetchUserProfile = () => {
    FB.api('/me', {fields: 'name,location'}, function(response) {
      setUserProfile(response);
      if (response.location) {
        setLocation(response.location.name);
      }
    });
  };

  const handleLogout = () => {
    if (window.FB) {
      FB.logout(function(response) {
        setIsLoggedIn(false);
        setUserProfile(null);
        setTrendData([]);
        setRelatedKeywords([]);
      });
    }
  };

  const handleSearch = async () => {
    if (!isLoggedIn) {
      handleFacebookLogin();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulation de données pour la démonstration
      const mockData = generateMockData();
      setTrendData(mockData.trends);
      setRelatedKeywords(mockData.related);
      setLoading(false);
    } catch (error) {
      setError('Une erreur est survenue');
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const trends = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return {
        date: date.toLocaleDateString('fr-FR'),
        recherches: Math.floor(Math.random() * 1000 + 500),
        prix_moyen: Math.floor(Math.random() * 200 + 50)
      };
    }).reverse();

    const related = [
      { keyword: `${keyword} occasion`, searches: Math.floor(Math.random() * 40000 + 10000), correlation: 0.8 },
      { keyword: `${keyword} pas cher`, searches: Math.floor(Math.random() * 30000 + 10000), correlation: 0.7 },
      { keyword: `${keyword} neuf`, searches: Math.floor(Math.random() * 20000 + 10000), correlation: 0.6 }
    ];

    return { trends, related };
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header fixe */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b z-50">
        <div className="flex items-center justify-between px-4 h-14">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80%] sm:w-[385px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                {!isLoggedIn ? (
                  <Button 
                    className="w-full" 
                    onClick={handleFacebookLogin}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Connexion Facebook
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                      Connecté en tant que {userProfile?.name}
                    </div>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={handleLogout}
                    >
                      Déconnexion
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
          
          <h1 className="text-lg font-semibold">Marketplace Analytics</h1>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 pt-14 pb-16 p-4">
        {!isLoggedIn ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <TrendingUp className="h-12 w-12 text-blue-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Analysez vos produits Marketplace
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Connectez-vous pour accéder aux données en temps réel
            </p>
            <Button onClick={handleFacebookLogin} size="lg">
              <LogIn className="mr-2 h-4 w-4" />
              Connexion avec Facebook
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Barre de recherche */}
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Localisation..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleSearch}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Recherche en cours...' : 'Rechercher'}
              </Button>
            </div>

            {/* Résultats */}
            {trendData.length > 0 && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="apercu">Aperçu</TabsTrigger>
                  <TabsTrigger value="details">Détails</TabsTrigger>
                </TabsList>

                <TabsContent value="apercu">
                  <div className="space-y-6">
                    {/* Graphique */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Tendances récentes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="date" 
                                tick={{ fontSize: 12 }}
                                interval={6}
                              />
                              <YAxis tick={{ fontSize: 12 }} />
                              <Tooltip />
                              <Legend />
                              <Line 
                                type="monotone" 
                                dataKey="recherches" 
                                stroke="#2563eb" 
                                name="Recherches"
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Statistiques rapides */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Prix moyen</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">
                            {trendData[trendData.length - 1].prix_moyen}€
                          </p>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Recherches</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold">
                            {trendData[trendData.length - 1].recherches}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details">
                  <div className="space-y-6">
                    {/* Mots-clés associés */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Mots-clés associés</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {relatedKeywords.map((item, idx) => (
                            <div 
                              key={idx}
                              className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium">{item.keyword}</p>
                                <p className="text-sm text-gray-500">
                                  {item.searches.toLocaleString()} recherches
                                </p>
                              </div>
                              <div className="text-sm text-gray-500">
                                {(item.correlation * 100).toFixed(0)}% corrélation
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
      </main>

      {/* Messages d'erreur */}
      {error && (
        <Alert variant="destructive" className="fixed bottom-4 left-4 right-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
