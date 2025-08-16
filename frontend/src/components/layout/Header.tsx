import React, { useState, useEffect } from 'react';
import { Users, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { apiService } from '../../services/api';
import Badge from '../ui/Badge';

const Header: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [systemHealth, setSystemHealth] = useState<'healthy' | 'degraded' | 'unknown'>('unknown');

  useEffect(() => {
    // Check system health
    const checkHealth = async () => {
      try {
        const health = await apiService.healthCheck();
        setSystemHealth(health.status === 'healthy' ? 'healthy' : 'degraded');
        setIsOnline(true);
      } catch {
        setSystemHealth('degraded');
        setIsOnline(false);
      }
    };

    checkHealth();
    
    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (!isOnline || systemHealth === 'degraded') {
      return <AlertCircle className="w-4 h-4 text-danger-500" />;
    }
    if (systemHealth === 'healthy') {
      return <CheckCircle className="w-4 h-4 text-success-500" />;
    }
    return <Activity className="w-4 h-4 text-warning-500 animate-pulse" />;
  };

  const getStatusText = () => {
    if (!isOnline) return 'Offline';
    if (systemHealth === 'degraded') return 'Issues Detected';
    if (systemHealth === 'healthy') return 'All Systems Operational';
    return 'Checking Status...';
  };

  const getStatusVariant = (): 'success' | 'warning' | 'danger' => {
    if (!isOnline || systemHealth === 'degraded') return 'danger';
    if (systemHealth === 'healthy') return 'success';
    return 'warning';
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                FYP Buddy
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Find Your Perfect Study Partner
              </p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2">
              {getStatusIcon()}
              <span className="text-sm text-gray-600">
                {getStatusText()}
              </span>
            </div>
            
            {/* Mobile Status Badge */}
            <div className="sm:hidden">
              <Badge variant={getStatusVariant()} size="sm">
                {systemHealth === 'healthy' ? 'Online' : 'Issues'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;