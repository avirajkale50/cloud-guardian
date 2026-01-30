import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Server, Activity, TrendingUp, Zap, Shield, BarChart3 } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-info/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-info flex items-center justify-center glow-primary">
                <Server className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Cloud Resource
              <span className="gradient-text block">Autoscaler</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Intelligent auto-scaling for your cloud infrastructure. Monitor metrics,
              make data-driven scaling decisions, and optimize costs automatically.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="xl" variant="gradient">
                <Link to="/register">Get Started Free</Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Everything you need for auto-scaling
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built for modern cloud infrastructure with powerful features to help you
            scale efficiently and reduce costs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={Activity}
            title="Real-time Monitoring"
            description="Track CPU, memory, and network metrics with live updates every 30 seconds."
          />
          <FeatureCard
            icon={TrendingUp}
            title="Smart Scaling"
            description="Automatic scaling decisions based on 5-minute sustained usage patterns."
          />
          <FeatureCard
            icon={Zap}
            title="Mock Testing"
            description="Test your scaling logic without AWS credentials using mock instances."
          />
          <FeatureCard
            icon={BarChart3}
            title="Visual Analytics"
            description="Beautiful charts and dashboards to visualize your infrastructure health."
          />
          <FeatureCard
            icon={Shield}
            title="Secure by Design"
            description="JWT authentication and secure API endpoints protect your data."
          />
          <FeatureCard
            icon={Server}
            title="Multi-Instance"
            description="Manage multiple instances across different regions from one dashboard."
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="glass-card rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to optimize your infrastructure?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Start monitoring and auto-scaling your cloud resources today.
            No credit card required.
          </p>
          <Button asChild size="xl" variant="gradient">
            <Link to="/register">Create Free Account</Link>
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-info flex items-center justify-center">
                <Server className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Cloud Autoscaler</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Cloud Autoscaler. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] group">
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Index;
