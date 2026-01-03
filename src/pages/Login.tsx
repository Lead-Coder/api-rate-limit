import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { verifyApiKey } from '../lib/authAPI';
import { Zap, Eye, EyeOff, ArrowRight, AlertCircle, Shield, Activity, Lock } from 'lucide-react';

const Login = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { login } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [usageData, setUsageData] = useState({
    requestsUsed: 0,
    rateLimit: 0,
    remainingQuota: 0,
    avgResponseTime: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const particles: Array<{x: number; y: number; vx: number; vy: number; radius: number}> = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();

        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!apiKey.trim()) {
      setError('Please enter your API key');
      return;
    }

  setIsLoading(true);

  try {
    if (apiKey.startsWith('admin_')) {
      login(apiKey, 'admin');
      navigate('/admin');
      return;
    }

    // const data = await verifyApiKey(apiKey);
    const res = await fetch('http://localhost:8080/client/stats', {
        headers: {
          'X-API-KEY': apiKey
        }
      });
    const data = await res.json();
    setUsageData(data);
    if(usageData.requestsUsed > usageData.rateLimit) {
      throw new Error('Requests limit is crossed');
    }
    else {
      login(apiKey, 'client');
      navigate('/client');
    }

  } catch (err) {
    setError('Invalid or inactive API key');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-slate-950 flex relative overflow-hidden pt-3">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-slate-950 to-cyan-600/20" />
      
      <div 
        className="hidden lg:flex lg:w-1/2 relative"
        onMouseMove={handleMouseMove}>
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.4 }}
        />

        {/* Gradient orbs with mouse parallax */}
        <div 
          className="absolute top-20 left-20 w-96 h-96 bg-violet-500/30 rounded-full blur-3xl transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${(mousePos.x - 50) * 0.02}px, ${(mousePos.y - 50) * 0.02}px)`
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl transition-transform duration-700 ease-out"
          style={{
            transform: `translate(${(mousePos.x - 50) * -0.03}px, ${(mousePos.y - 50) * -0.03}px)`
          }}
        />

        {/* Floating rings */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 border-2 border-white/30 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
          <div className="absolute top-1/3 right-1/3 w-96 h-96 border border-white/20 rounded-full animate-pulse" style={{ animationDuration: '5s' }} />
          <div className="absolute bottom-1/4 left-1/2 w-48 h-48 border-2 border-white/25 rounded-full animate-ping" style={{ animationDuration: '6s' }} />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16">
          {/* Logo with glow */}
          <div className="flex items-center gap-4 mb-8 group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center relative shadow-2xl shadow-violet-500/50 group-hover:shadow-violet-500/70 transition-all duration-300">
              <Zap className="w-9 h-9 text-white animate-pulse" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 blur-xl opacity-60 group-hover:opacity-80 transition-opacity" />
            </div>
            <span className="text-4xl font-bold bg-gradient-to-r from-white via-violet-200 to-cyan-200 bg-clip-text text-transparent">
              RateLimiter
            </span>
          </div>
          
          <h1 className="text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
            Smart API Rate
            <span className="block bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Limiting & Analytics
            </span>
          </h1>
          
          <p className="text-lg text-slate-300 leading-relaxed max-w-md mb-12">
            Monitor, manage, and optimize your API usage with powerful rate limiting 
            and real-time analytics dashboard.
          </p>

          {/* Feature cards */}
          <div className="space-y-4 max-w-md">
            {[
              { icon: Shield, label: 'Enterprise Security', desc: 'Bank-level encryption' },
              { icon: Activity, label: 'Real-time Monitoring', desc: 'Live traffic analytics' },
              { icon: Lock, label: 'Smart Rate Limits', desc: 'Adaptive throttling' }
            ].map((feature, i) => (
              <div 
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center group-hover:from-violet-500/30 group-hover:to-cyan-500/30 transition-all">
                  <feature.icon className="w-6 h-6 text-violet-300" />
                </div>
                <div>
                  <p className="text-white font-semibold">{feature.label}</p>
                  <p className="text-sm text-slate-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 mb-12 flex items-center gap-8">
            <div className="group cursor-default">
              <p className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-white bg-clip-text text-transparent">99%</p>
              <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Uptime</p>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <div className="group cursor-default">
              <p className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-white bg-clip-text text-transparent">100+</p>
              <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">API Calls/Day</p>
            </div>
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <div className="group cursor-default">
              <p className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">&lt;1ms</p>
              <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">Latency</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/50">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">RateLimiter</span>
          </div>

          {/* Form card with glassmorphism */}
          <div className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-8 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
              <p className="text-slate-400">Enter your API key to access the dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* API Key Input */}
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-slate-300 mb-2">
                  API Key
                </label>
                <div className="relative group">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-1234567890abcdef"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all pr-12"
                    autoComplete="off"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-cyan-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-pulse" style={{ animationDuration: '2s' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Hint */}
            <div className="mt-6 p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
              <p className="text-sm text-slate-300">
                <strong className="text-white">Demo:</strong> Use{' '}
                <code className="px-2 py-1 rounded-lg bg-white/10 text-violet-300 font-mono text-xs">admin_*</code>{' '}
                for admin or any key for client access.
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-slate-400">
            Need an API key?{' '}
            <a href="#" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Contact your administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;