import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FormField, Input, Button, useSnackbar } from '@pacifico/ui-kit';
import { Lock, User } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { useAuthStore } from '../../stores/auth-store';

interface LoginFormData {
  rut: string;
  password: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { show } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const result = await authService.login(data.rut, data.password);
      login(result.accessToken, result.refreshToken);
      show('Bienvenido al sistema', { type: 'success' });
      navigate('/dashboard');
    } catch {
      show('RUT o contraseña incorrectos', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] bg-ink-900 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 30%, white 1px, transparent 1px), radial-gradient(circle at 75% 70%, white 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute top-0 left-0 right-0 h-[3px] flex">
          <span className="h-full flex-1 bg-gob-primary" />
          <span className="h-full flex-1 bg-white" />
          <span className="h-full flex-1 bg-gob-error" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-xl w-full">
          <div className="flex items-center gap-s">
            <div className="w-10 h-10 rounded-l bg-white flex items-center justify-center">
              <span className="text-gob-primary font-bold text-lg font-display">S</span>
            </div>
            <div>
              <p className="text-white font-display text-lg font-semibold">Salud JUNAEB</p>
              <p className="text-white/60 text-[11px] tracking-wider uppercase">Gobierno de Chile</p>
            </div>
          </div>

          <div className="max-w-md">
            <h1 className="font-display text-4xl font-bold text-white leading-[1.15] tracking-tight text-balance">
              Sistema de Gestión
              <br />
              de Salud
            </h1>
            <p className="text-white/50 mt-m text-[14px] leading-relaxed max-w-sm">
              Plataforma de administración de servicios de salud
              para la Junta Nacional de Auxilio Escolar y Becas.
            </p>
          </div>

          <div className="flex items-center gap-m text-white/40 text-[11px]">
            <span>© 2026 JUNAEB</span>
            <span className="w-px h-3 bg-white/20" />
            <span>Todos los derechos reservados</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-ink-50 p-xl">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-s mb-xl justify-center">
            <div className="w-10 h-10 rounded-l bg-gob-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg font-display">S</span>
            </div>
            <div>
              <p className="text-ink-800 font-display text-lg font-semibold">Salud JUNAEB</p>
              <p className="text-ink-500 text-[11px] tracking-wider uppercase">Panel Admin</p>
            </div>
          </div>

          <div className="animate-fade-up">
            <h2 className="font-display text-2xl font-bold text-ink-800 tracking-tight">
              Iniciar Sesión
            </h2>
            <p className="text-ink-500 text-[13px] mt-xxs mb-xl">
              Ingresa tus credenciales para acceder al sistema
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-m">
              <FormField label="RUT" required error={errors.rut?.message}>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-s top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"
                    strokeWidth={1.75}
                  />
                  <Input
                    {...register('rut', { required: 'El RUT es requerido' })}
                    placeholder="12345678-9"
                    error={!!errors.rut}
                    className="pl-xl"
                  />
                </div>
              </FormField>

              <FormField label="Contraseña" required error={errors.password?.message}>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-s top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"
                    strokeWidth={1.75}
                  />
                  <Input
                    {...register('password', { required: 'La contraseña es requerida' })}
                    type="password"
                    placeholder="••••••••"
                    error={!!errors.password}
                    className="pl-xl"
                  />
                </div>
              </FormField>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full mt-l"
              >
                Iniciar Sesión
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
