import React from 'react';
import { Server, Activity, TrendingUp } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-card via-background to-secondary/30 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-info/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center">
              <Server className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Cloud Autoscaler</h1>
              <p className="text-sm text-muted-foreground">Resource Management</p>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 space-y-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-card/50 backdrop-blur border border-border/50">
              <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Real-time Monitoring</h3>
                <p className="text-sm text-muted-foreground">Track CPU, memory, and network metrics with live updates every 30 seconds</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-xl bg-card/50 backdrop-blur border border-border/50">
              <div className="w-10 h-10 rounded-lg bg-warning/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Intelligent Scaling</h3>
                <p className="text-sm text-muted-foreground">Automatic scaling decisions based on 5-minute sustained usage patterns</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-xl bg-card/50 backdrop-blur border border-border/50">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Server className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Mock Testing</h3>
                <p className="text-sm text-muted-foreground">Test scaling logic without AWS - simulate any metric scenario</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-sm text-muted-foreground">
          © 2026 Cloud Autoscaler. Built for scale.
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-info flex items-center justify-center">
              <Server className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Cloud Autoscaler</h1>
          </div>
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground">{title}</h2>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};
