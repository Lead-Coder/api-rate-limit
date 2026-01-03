import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';

const NotAuthorized = () => {
  const { role, isAuthenticated } = useAuth();

  const getRedirectPath = () => {
    if (!isAuthenticated) return '/login';
    return role === 'admin' ? '/admin' : '/client';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md animate-fade-in">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-destructive/10 flex items-center justify-center">
          <ShieldX className="w-12 h-12 text-destructive" />
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Access Denied
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          You don't have permission to access this page. This area requires different privileges 
          than your current role provides.
        </p>

        {/* Error Code */}
        <div className="inline-block px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-mono mb-8">
          Error 403 - Forbidden
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={getRedirectPath()}
            className="btn-primary"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn-secondary"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-muted-foreground">
          If you believe this is an error, please{' '}
          <a href="#" className="text-primary hover:underline">contact support</a>.
        </p>
      </div>
    </div>
  );
};

export default NotAuthorized;
