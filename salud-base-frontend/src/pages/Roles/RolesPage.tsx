import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Modal,
  FormField,
  Input,
  Select,
  Button,
  Toggle,
  StatusBadge,
  useSnackbar,
} from '@pacifico/ui-kit';
import { useCrud } from '../../hooks/use-crud';
import { CrudView, type CrudColumn } from '../../components/Crud';
import type { Rol } from '../../types';

interface RolFormData {
  codigo: string;
  nombre: string;
  descripcion?: string;
  requiere_contexto: string;
  activo: boolean;
}

const contextoOptions = [
  { value: 'GLOBAL', label: 'Global' },
  { value: 'REGIONAL', label: 'Regional' },
  { value: 'PRESTADOR', label: 'Prestador' },
];

export function RolesPage() {
  const { data, total, totalPages, loading, currentPage, create, update, remove, setPage } =
    useCrud<Rol>({ endpoint: '/roles' });
  const { show } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<number | null>(null);
  const { register, handleSubmit, reset, control, formState: { errors } } =
    useForm<RolFormData>();

  const handleCreate = () => {
    setModalMode('create');
    setEditingId(null);
    reset({ activo: true, requiere_contexto: 'GLOBAL' } as RolFormData);
    setOpenModal(true);
  };

  const handleEdit = (row: Rol) => {
    setModalMode('edit');
    setEditingId(row.rol_id);
    reset(row as unknown as RolFormData);
    setOpenModal(true);
  };

  const onSubmit = async (formData: RolFormData) => {
    try {
      if (modalMode === 'create') {
        await create(formData);
        show('Rol creado correctamente', { type: 'success' });
      } else {
        await update(editingId!, formData);
        show('Rol actualizado correctamente', { type: 'success' });
      }
      setOpenModal(false);
    } catch {
      show('Error al guardar el rol', { type: 'error' });
    }
  };

  const columns: CrudColumn<Rol>[] = [
    { key: 'codigo', label: 'Código' },
    { key: 'nombre', label: 'Nombre' },
    {
      key: 'descripcion',
      label: 'Descripción',
      render: (value) => (value as string) || '-',
    },
    { key: 'requiere_contexto', label: 'Contexto' },
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
        title="Roles"
        columns={columns}
        data={data}
        total={total}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={(row) => remove(row.rol_id)}
        idField="rol_id"
      />
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={modalMode === 'create' ? 'Crear Rol' : 'Editar Rol'}
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
              placeholder="ROL_ADMIN"
            />
          </FormField>
          <FormField label="Nombre" required error={errors.nombre?.message}>
            <Input
              {...register('nombre', { required: 'El nombre es requerido' })}
              error={!!errors.nombre}
            />
          </FormField>
          <FormField label="Descripción">
            <Input {...register('descripcion')} />
          </FormField>
          <FormField
            label="Requiere Contexto"
            required
            error={errors.requiere_contexto?.message}
          >
            <Controller
              control={control}
              name="requiere_contexto"
              rules={{ required: 'El contexto es requerido' }}
              render={({ field }) => (
                <Select
                  options={contextoOptions}
                  value={
                    contextoOptions.find((o) => o.value === field.value) ?? null
                  }
                  onChange={(opt: { value: string; label: string } | null) =>
                    field.onChange(opt?.value ?? '')
                  }
                  placeholder="Selecciona..."
                  error={!!errors.requiere_contexto}
                />
              )}
            />
          </FormField>
          <FormField label="Activo">
            <Toggle label="Rol activo" {...register('activo')} />
          </FormField>
        </form>
      </Modal>
    </div>
  );
}
