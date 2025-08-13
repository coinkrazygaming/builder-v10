import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  ExternalLink,
  Info
} from "lucide-react";

export default function DatabaseStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected' | 'error'>('checking');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkDatabaseConnection = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Test database connection through a simple API call
      const response = await fetch('/api/ping');
      
      if (response.ok) {
        setStatus('connected');
      } else {
        setStatus('disconnected');
        setError('API server not responding');
      }
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkDatabaseConnection();
  }, []);

  const getStatusBadge = () => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-500 text-white">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="secondary">Disconnected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'checking':
        return <Badge variant="outline">Checking...</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'disconnected':
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'checking':
        return <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />;
      default:
        return <Database className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <CardTitle className="text-lg">Database Status</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
        <CardDescription>
          Neon PostgreSQL connection status
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'connected' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your application is successfully connected to Neon PostgreSQL database.
            </AlertDescription>
          </Alert>
        )}

        {(status === 'disconnected' || status === 'error') && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Database connection failed. {error && `Error: ${error}`}
            </AlertDescription>
          </Alert>
        )}

        {(status === 'disconnected' || status === 'error') && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Need to set up your database? Check the{" "}
              <a 
                href="/DATABASE_SETUP.md" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center"
              >
                setup guide <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkDatabaseConnection}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Test Connection
          </Button>
          
          {status === 'connected' && (
            <Button variant="outline" size="sm" asChild>
              <a 
                href="http://localhost:4983" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Database className="w-4 h-4 mr-2" />
                Open Studio
              </a>
            </Button>
          )}
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Quick Commands:</strong></p>
          <code className="text-xs bg-muted px-2 py-1 rounded block">npm run db:test</code>
          <code className="text-xs bg-muted px-2 py-1 rounded block">npm run db:push</code>
          <code className="text-xs bg-muted px-2 py-1 rounded block">npm run db:studio</code>
        </div>
      </CardContent>
    </Card>
  );
}
