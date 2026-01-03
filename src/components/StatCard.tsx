import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: number;
  trendLabel?: string;
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'destructive';
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendLabel = 'vs last period',
  variant = 'default' 
}: StatCardProps) => {
  const variantStyles = {
    default: 'bg-card',
    primary: 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20',
    accent: 'bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20',
    success: 'bg-gradient-to-br from-success/10 to-success/5 border-success/20',
    warning: 'bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20',
    destructive: 'bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20',
  };

  const iconStyles = {
    default: 'bg-muted text-muted-foreground',
    primary: 'bg-primary/20 text-primary',
    accent: 'bg-accent/20 text-accent',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    destructive: 'bg-destructive/20 text-destructive',
  };

  const isPositive = trend !== undefined && trend >= 0;

  return (
    <div className={`stat-card ${variantStyles[variant]} animate-fade-in`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          
          {trend !== undefined && (
            <div className="flex items-center gap-1.5 mt-3">
              <span className={`flex items-center gap-1 text-sm font-medium ${
                isPositive ? 'text-success' : 'text-destructive'
              }`}>
                {isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {Math.abs(trend)}%
              </span>
              <span className="text-xs text-muted-foreground">{trendLabel}</span>
            </div>
          )}
        </div>
        
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconStyles[variant]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
