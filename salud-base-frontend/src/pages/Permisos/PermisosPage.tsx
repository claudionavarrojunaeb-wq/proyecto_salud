import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Modal,
  FormField,
  Input,
  Button,
  Toggle,
  StatusBadge,
  useSnackbar,
} from '@pacifico/ui-kit';
import { useCrud } from '../../hooks/use-crud';
import { CrudView, type CrudColumn } from '../../components/Crud';
import type { Permiso } from '../../types';

interface PermisoFormData {
  codigo: string;
  modulo: string;
  accion: string;
  descripcion?: string;
  activo: boolean;
}

export function PermisosPage() {
  const { data, total, totalPages, loading, currentPage, create, update, remove, setPage } =
    useCrud<Permiso>({ endpoint: '/permisos' });
  const { show } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<number | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<PermisoFormData>();

  const handleCreate = () => {
    setModalMode('create');
    setEditingId(null);
    reset({ activo: true } as PermisoFormData);
    setOpenModal(true);
  };

  const handleEdit = (row: Permiso) => {
    setModalMode('edit');
    setEditingId(row.permiso_id);
    reset(row as unknown as PermisoFormData);
    setOpenModal(true);
  };

  const onSubmit = async (formData: PermisoFormData) => {
    try {
      if (modalMode === 'create') {
        await create(formData);
        show('Permiso creado correctamente', { type: 'success' });
      } else {
        await update(editingId!, formData);
        show('Permiso actualizado correctamente', { type: 'success' });
      }
      setOpenModal(false);
    } catch {
      show('Error al guardar el permiso', { type: 'error' });
    }
  };

  const columns: CrudColumn<Permiso>[] = [
    { key: 'codigo', label: 'Código' },
    { key: 'modulo', label: 'Módulo' },
    { key: 'accion', label: 'Acción' },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (value) => (value as string) || '-',
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (_value, row) => (
        <StatusBadge variant={row.activo ? 'success' : 'neutral'}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div>
      <CrudView
        title="Permisos"
        columns={columns}
        data={data}
        total={total}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={(row) => remove(row.permiso_id)}
        idField="permiso_id"
      />
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={modalMode === 'create' ? 'Crear Permiso' : 'Editar Permiso'}
        size="md"
        footer={
          <div className="flex justify-end gap-s">
            <Button variant="secondary" onClick={() => setOpenModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSubmit(onSubmit)}>
              {modalMode === 'create' ? 'Crear' : 'Guardar'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-m">
          <FormField label="Código" required error={errors.codigo?.message}>
            <Input
              {...register('codigo', { required: 'El código es requerido' })}
              error={!!errors.codigo}
              placeholder="usuarios:read"
            />
          </FormField>
          <FormField label="Módulo" required error={errors.modulo?.message}>
            <Input
              {...register('modulo', { required: 'El módulo es requerido' })}
              error={!!errors.modulo}
              placeholder="usuarios"
            />
          </FormField>
          <FormField label="Acción" required error={errors.accion?.message}>
            <Input
              {...register('accion', { required: 'La acción es requerida' })}
              error={!!errors.accion}
              placeholder="read"
            />
          </FormField>
          <FormField label="Descripción">
            <Input {...register('descripcion')} />
          </FormField>
          <FormField label="Activo">
            <Toggle label="Permiso activo" {...register('activo')} />
          </FormField>
        </form>
      </Modal>
    </div>
  );
}
