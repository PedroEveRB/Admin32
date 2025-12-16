import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { Lock, User, Shield, AlertTriangle, RefreshCw } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, serverError, checkServerHealth } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleRetryConnection = async () => {
    setLoading(true);
    try {
      const healthy = await checkServerHealth();
      addNotification({
        type: healthy ? 'success' : 'error',
        title: healthy ? 'Conexão Restaurada' : 'Servidor Indisponível',
        message: healthy
          ? 'Servidor está disponível novamente.'
          : 'O servidor ainda não está respondendo.'
      });
    } catch {
      addNotification({
        type: 'error',
        title: 'Erro de Conexão',
        message: 'Não foi possível verificar o status do servidor.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, senha);
      addNotification({
        type: 'success',
        title: 'Login realizado com sucesso!',
        message: 'Bem-vindo ao painel administrativo.'
      });
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Erro no login',
        message: error.message || 'Credenciais inválidas.'
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= ERRO DE SERVIDOR ================= */
  if (serverError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-white shadow-2xl border-0">
          <div className="text-center p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 rounded-full p-4">
                <AlertTriangle className="text-red-600" size={48} />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Servidor Indisponível
            </h1>

            <p className="text-gray-600 mb-6">
              O servidor não está respondendo no momento.
            </p>

            <Button onClick={handleRetryConnection} disabled={loading} className="w-full">
              <RefreshCw size={16} className="mr-2" />
              {loading ? 'Verificando...' : 'Tentar Novamente'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  /* ================= LOGIN ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <Card className="w-full max-w-lg bg-white shadow-xl border-0 relative z-10">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>

        {/* LOGO + TÍTULO */}
        <div className="text-center pt-8 pb-6">
          <img
            src="./logo.png"
            alt="SamCast Logo"
            className="h-32 w-auto mx-auto mb-4"
          />

          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Gerenciamento Administrativo
          </h1>

          <p className="text-gray-600 text-lg font-medium">
            Painel Administrativo de Streaming
          </p>

          <div className="flex items-center justify-center space-x-2 mt-4">
            <Shield className="text-gray-400" size={16} />
            <span className="text-sm text-gray-500">Acesso seguro e protegido</span>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-8 px-2 pb-8">
          <div className="relative">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              required
              className="pl-14 py-4 text-lg rounded-2xl bg-gray-50"
            />
            <User className="absolute left-5 top-11 text-purple-400" size={20} />
          </div>

          <div className="relative">
            <Input
              label="Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              required
              className="pl-14 py-4 text-lg rounded-2xl bg-gray-50"
            />
            <Lock className="absolute left-5 top-11 text-purple-400" size={20} />
          </div>

          <button
            type="submit"
            disabled={loading || !email || !senha}
            className="w-full bg-gradient-to-r from-slate-800 via-purple-600 to-indigo-600 text-white font-bold py-5 rounded-2xl transition-all hover:scale-105 disabled:opacity-50 shadow-xl"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </Card>
    </div>
  );
};
