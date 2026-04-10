/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  PieChart, 
  ShieldCheck, 
  Zap,
  Moon,
  Sun,
  Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

import { MOCK_STOCKS, type Stock } from "@/src/lib/mockData";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isInvested, setIsInvested] = useState(false);
  const [planChecked, setPlanChecked] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(10000);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredStocks = useMemo(() => {
    return MOCK_STOCKS.filter(stock => {
      const matchesSearch = stock.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           stock.symbol.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filter === "gainers") return matchesSearch && stock.change > 1;
      if (filter === "losers") return matchesSearch && stock.change < -1;
      if (filter === "stable") return matchesSearch && Math.abs(stock.change) <= 1;
      
      return matchesSearch;
    });
  }, [searchQuery, filter]);

  const allocation = {
    equity: investmentAmount * 0.6,
    debt: investmentAmount * 0.3,
    sip: investmentAmount * 0.05,
    buffer: investmentAmount * 0.05,
  };

  const handleInvest = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: 'Executing investment plan...',
        success: () => {
          setIsInvested(true);
          return 'Your investment plan has been executed successfully.';
        },
        error: 'Failed to execute investment.',
      }
    );
  };

  const handleCheckPlan = () => {
    setPlanChecked(true);
    toast.success("Plan optimized! We've adjusted your allocation for better returns.");
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen transition-colors duration-300`}>
      <div className="bg-background text-foreground min-h-screen font-sans">
        <Toaster position="top-center" />
        
        {/* Navigation */}
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">InvestDash</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Wallet className="h-4 w-4" />
                <span>Balance: $24,500.00</span>
              </div>
              <Separator orientation="vertical" className="hidden md:block h-6" />
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4 text-muted-foreground" />
                <Switch 
                  checked={isDarkMode} 
                  onCheckedChange={setIsDarkMode} 
                  aria-label="Toggle dark mode"
                />
                <Moon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto py-8 px-4 space-y-8">
          
          {/* Hero / Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Market Overview</h1>
              <p className="text-muted-foreground">Track your favorite stocks and manage your portfolio.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search stocks..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Tabs value={filter} onValueChange={setFilter} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-4 sm:w-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="gainers">Gainers</TabsTrigger>
                  <TabsTrigger value="losers">Losers</TabsTrigger>
                  <TabsTrigger value="stable">Stable</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Stock List Section */}
          <section>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="pb-2">
                      <div className="h-4 w-24 bg-muted rounded mb-2" />
                      <div className="h-3 w-16 bg-muted rounded" />
                    </CardHeader>
                    <CardContent>
                      <div className="h-8 w-20 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <ScrollArea className="h-[400px] rounded-xl border bg-card/50 p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredStocks.map((stock) => (
                      <motion.div
                        key={stock.symbol}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="hover:shadow-md transition-shadow cursor-pointer border-muted/60">
                          <CardHeader className="p-4 pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg font-bold">{stock.symbol}</CardTitle>
                                <CardDescription className="text-xs truncate max-w-[120px]">{stock.name}</CardDescription>
                              </div>
                              <Badge variant={stock.change >= 0 ? "default" : "destructive"} className="text-[10px] px-1.5 py-0">
                                {stock.change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                {Math.abs(stock.change)}%
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-bold">${stock.price.toFixed(2)}</span>
                              <span className={`text-xs ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {stock.change >= 0 ? '+' : ''}{(stock.price * stock.change / 100).toFixed(2)}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {filteredStocks.length === 0 && (
                    <div className="col-span-full py-20 text-center text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No stocks found matching your criteria.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Investment Plan Section */}
            <Card className="lg:col-span-2 border-primary/10 shadow-lg overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <CardHeader>
                <div className="flex items-center gap-2 text-primary mb-1">
                  <PieChart className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Strategic Allocation</span>
                </div>
                <CardTitle className="text-2xl">Your Investment Plan</CardTitle>
                <CardDescription>Based on your risk profile and market conditions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-yellow-500" /> Equity (High Growth)</span>
                        <span className="font-bold">60%</span>
                      </div>
                      <Progress value={60} className="h-2" />
                      <p className="text-xs text-muted-foreground">${allocation.equity.toLocaleString()} allocated to blue-chip & growth stocks.</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-500" /> Debt (Stable Income)</span>
                        <span className="font-bold">30%</span>
                      </div>
                      <Progress value={30} className="h-2" />
                      <p className="text-xs text-muted-foreground">${allocation.debt.toLocaleString()} in government bonds & corporate debt.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> SIP (Monthly)</span>
                        <span className="font-bold">5%</span>
                      </div>
                      <Progress value={5} className="h-2" />
                      <p className="text-xs text-muted-foreground">${allocation.sip.toLocaleString()} recurring monthly investment.</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2"><Wallet className="h-4 w-4 text-muted-foreground" /> Buffer (Liquidity)</span>
                        <span className="font-bold">5%</span>
                      </div>
                      <Progress value={5} className="h-2" />
                      <p className="text-xs text-muted-foreground">${allocation.buffer.toLocaleString()} kept as cash for opportunities.</p>
                    </div>
                  </div>
                </div>

                {planChecked && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3"
                  >
                    <div className="bg-primary/10 p-2 rounded-full h-fit">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-primary">Optimization Suggestion</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        We recommend increasing your **Equity** allocation by 5% and reducing **Debt** by 5% based on current bullish trends in the Technology sector.
                      </p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
              <CardFooter className="bg-muted/30 border-t flex justify-between items-center p-6">
                <div className="text-sm">
                  <span className="text-muted-foreground">Total Investment:</span>
                  <span className="ml-2 font-bold text-lg">${investmentAmount.toLocaleString()}</span>
                </div>
                <Button variant="outline" onClick={handleCheckPlan} disabled={planChecked}>
                  {planChecked ? "Plan Validated" : "Check Plan"}
                </Button>
              </CardFooter>
            </Card>

            {/* Action Section */}
            <div className="space-y-6">
              <Card className="border-primary shadow-xl bg-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle>Execute Investment</CardTitle>
                  <CardDescription className="text-primary-foreground/70">Ready to grow your wealth? Execute your plan with one click.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">Instant execution</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">Secured by InvestDash</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-white text-primary hover:bg-white/90 font-bold text-lg h-14"
                    onClick={handleInvest}
                    disabled={isInvested}
                  >
                    {isInvested ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5" /> Invested Successfully
                      </span>
                    ) : (
                      "Invest Now"
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {isInvested && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center space-y-2"
                >
                  <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-green-600 dark:text-green-400">Success!</h3>
                  <p className="text-sm text-muted-foreground">Your investment plan has been executed successfully. You can track your performance in the portfolio tab.</p>
                </motion.div>
              )}

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Market Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      <span className="font-bold">Bullish</span>
                    </div>
                    <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full font-medium">Strong Buy</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </main>

        {/* Footer */}
        <footer className="border-t py-8 mt-12 bg-muted/20">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© 2026 InvestDash Financial Services. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-2">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Help Center</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
