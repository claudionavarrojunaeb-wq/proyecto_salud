import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Modal,
  FormField,
  Input,
  Button,
  StatusBadge,
  useSnackbar,
  I,
} from '@pacifico/ui-kit';
import { useCrud } from '../../hooks/use-crud';
import { CrudView, type CrudColumn } from '../../components/Crud';
import api from '../../lib/axios';
import type { Notificacion } from '../../types';

interface NotificacionFormData {
  usuario_id: number;
  tipo: string;
  titulo: string;
  mensaje: string;
}

export function NotificacionesPage() {
  const {
    data,
    total,
    totalPages,
    loading,
    currentPage,
    create,
    remove,
    setPage,
    refresh,
  } = useCrud<Notificacion>({ endpoint: '/notificaciones' });
  const { show } = useSnackbar();
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [markingId, setMarkingId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NotificacionFormData>();

  const openCreate = () => {
    reset({ usuario_id: 0, tipo: '', titulo: '', mensaje: '' });
    setModalOpen(true);
  };

  const onSubmit = async (formData: NotificacionFormData) => {
    setSaving(true);
    try {
      await create({
        usuario_id: Number(formData.usuario_id),
        tipo: formData.tipo,
        titulo: formData.titulo,
        mensaje: formData.mensaje,
      });
      show('Notificación creada', { type: 'success' });
      setModalOpen(false);
    } catch {
      show('Error al crear notificación', { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: Notificacion) => {
    try {
      await remove(row.notificacion_id);
      show('Notificación eliminada', { type: 'success' });
    } catch {
      show('Error al eliminar notificación', { type: 'error' });
    }
  };

  const handleMarkAsRead = async (row: Notificacion) => {
    setMarkingId(row.notificacion_id);
    try {
      await api.patch(`/notificaciones/${row.notificacion_id}/leida`);
      show('Notificación marcada como leída', { type: 'success' });
      refresh();
    } catch {
      show('Error al marcar como leída', { type: 'error' });
    } finally {
      setMarkingId(null);
    }
  };

  const columns: CrudColumn<Notificacion>[] = [
    { key: 'titulo', label: 'Título' },
    {
      key: 'mensaje',
      label: 'Mensaje',
      render: (_v, row) => (
        <span title={row.mensaje}>
          {row.mensaje.length > 50
            ? `${row.mensaje.slice(0, 50)}...`
            : row.mensaje}
        </span>
      ),
    },
    { key: 'tipo', label: 'Tipo' },
    {
      key: 'leida',
      label: 'Estado',
      render: (_v, row) => (
        <StatusBadge variant={row.leida ? 'success' : 'warning'}>
          {row.leida ? 'Leída' : 'No leída'}
        </StatusBadge>
      ),
    },
    {
      key: 'fecha_creacion',
      label: 'Fecha',
      render: (_v, row) =>
        new Date(row.fecha_creacion).toLocaleString('es-CL'),
    },
    {
      key: '_marcar',
      label: 'Marcar',
      render: (_v, row) =>
        row.leida ? (
          <span className="text-gray-400 text-sm">—</span>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            loading={markingId === row.notificacion_id}
            onClick={() => handleMarkAsRead(row)}
          >
            <I.Check size={16} />
          </Button>
        ),
    },
  ];

  return (
    <div className="space-y-l">
      {/* <div>
        <h1 className="font-display text-3xl font-bold text-ink-800 mb-xs tracking-tight">
          Notificaciones
        </h1>
        <p className="text-ink-500 text-[14px]">Gestión de notificaciones del sistema</p>
      </div> */}

      <CrudView
        title="Notificaciones"
        columns={columns}
        data={data}
        total={total}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
        onCreate={openCreate}
        onDelete={handleDelete}
        idField="notificacion_id"
        createLabel="Crear notificación"
        canEdit={false}
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Crear Notificación"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              loading={saving}
              onClick={handleSubmit(onSubmit)}
            >
              Crear
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-m">
          <FormField
            label="ID Usuario"
            required
            error={errors.usuario_id?.message}
          >
            <Input
              {...register('usuario_id', { valueAsNumber: true })}
              type="number"
              min={1}
              placeholder="1"
              error={!!errors.usuario_id}
            />
          </FormField>
          <FormField label="Tipo" required error={errors.tipo?.message}>
            <Input
              {...register('tipo')}
              placeholder="Ej: alerta, info, sistema"
              error={!!errors.tipo}
            />
          </FormField>
          <FormField label="Título" required error={errors.titulo?.message}>
            <Input
              {...register('titulo')}
              placeholder="Título de la notificación"
              error={!!errors.titulo}
            />
          </FormField>
          <FormField label="Mensaje" required error={errors.mensaje?.message}>
            <Input
              {...register('mensaje')}
              placeholder="Mensaje de la notificación"
              error={!!errors.mensaje}
            />
          </FormField>
        </form>
      </Modal>
    </div>
  );
}
