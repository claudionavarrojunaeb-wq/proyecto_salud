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
import type { Region } from '../../types';

interface RegionFormData {
  codigo: string;
  nombre: string;
  abreviatura?: string;
  orden_visual?: number;
  activo: boolean;
}

export function RegionesPage() {
  const { data, total, totalPages, loading, currentPage, create, update, remove, setPage } =
    useCrud<Region>({ endpoint: '/regiones' });
  const { show } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<number | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<RegionFormData>();

  const handleCreate = () => {
    setModalMode('create');
    setEditingId(null);
    reset({ activo: true } as RegionFormData);
    setOpenModal(true);
  };

  const handleEdit = (row: Region) => {
    setModalMode('edit');
    setEditingId(row.region_id);
    reset(row as unknown as RegionFormData);
    setOpenModal(true);
  };

  const onSubmit = async (formData: RegionFormData) => {
    try {
      if (modalMode === 'create') {
        await create(formData);
        show('Región creada correctamente', { type: 'success' });
      } else {
        await update(editingId!, formData);
        show('Región actualizada correctamente', { type: 'success' });
      }
      setOpenModal(false);
    } catch {
      show('Error al guardar la región', { type: 'error' });
    }
  };

  const columns: CrudColumn<Region>[] = [
    { key: 'codigo', label: 'Código' },
    { key: 'nombre', label: 'Nombre' },
    {
      key: 'abreviatura',
      label: 'Abreviatura',
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
        title="Regiones"
        columns={columns}
        data={data}
        total={total}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={(row) => remove(row.region_id)}
        idField="region_id"
      />
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={modalMode === 'create' ? 'Crear Región' : 'Editar Región'}
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
              placeholder="RM"
            />
          </FormField>
          <FormField label="Nombre" required error={errors.nombre?.message}>
            <Input
              {...register('nombre', { required: 'El nombre es requerido' })}
              error={!!errors.nombre}
              placeholder="Región Metropolitana"
            />
          </FormField>
          <FormField label="Abreviatura">
            <Input {...register('abreviatura')} placeholder="RM" />
          </FormField>
          <FormField label="Orden Visual">
            <Input
              type="number"
              {...register('orden_visual', { valueAsNumber: true })}
              placeholder="1"
            />
          </FormField>
          <FormField label="Activo">
            <Toggle label="Región activa" {...register('activo')} />
          </FormField>
        </form>
      </Modal>
    </div>
  );
}
