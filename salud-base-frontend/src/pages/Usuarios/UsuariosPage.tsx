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
} from 'junaeb-ds-kit';
import { useCrud } from '../../hooks/use-crud';
import { CrudView, type CrudColumn } from '../../components/Crud';
import type { Usuario } from '../../types';

interface UsuarioFormData {
  rut: string;
  nombres: string;
  primer_apellido: string;
  segundo_apellido?: string;
  tipo_usuario: string;
  correo_electronico: string;
  password?: string;
  activo: boolean;
}

const tipoUsuarioOptions = [
  { value: 'INTERNO', label: 'Interno' },
  { value: 'PRESTADOR', label: 'Prestador' },
];

export function UsuariosPage() {
  const { data, total, totalPages, loading, currentPage, create, update, remove, setPage } =
    useCrud<Usuario>({ endpoint: '/usuarios' });
  const { show } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<number | null>(null);
  const { register, handleSubmit, reset, control, formState: { errors } } =
    useForm<UsuarioFormData>();

  const handleCreate = () => {
    setModalMode('create');
    setEditingId(null);
    reset({ activo: true } as UsuarioFormData);
    setOpenModal(true);
  };

  const handleEdit = (row: Usuario) => {
    setModalMode('edit');
    setEditingId(row.usuario_id);
    reset(row as unknown as UsuarioFormData);
    setOpenModal(true);
  };

  const onSubmit = async (formData: UsuarioFormData) => {
    try {
      if (modalMode === 'create') {
        await create(formData);
        show('Usuario creado correctamente', { type: 'success' });
      } else {
        const { password: _password, ...rest } = formData;
        await update(editingId!, rest);
        show('Usuario actualizado correctamente', { type: 'success' });
      }
      setOpenModal(false);
    } catch {
      show('Error al guardar el usuario', { type: 'error' });
    }
  };

  const columns: CrudColumn<Usuario>[] = [
    { key: 'rut', label: 'RUT' },
    {
      key: 'nombres',
      label: 'Nombre',
      render: (_value, row) => `${row.nombres} ${row.primer_apellido}`,
    },
    { key: 'correo_electronico', label: 'Correo' },
    { key: 'tipo_usuario', label: 'Tipo' },
    {
      key: 'activo',
      label: 'Estado',
      render: (_value, row) => (
        <StatusBadge variant={row.activo ? 'success' : 'neutral'}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </StatusBadge>
      ),
    },
    {
      key: 'fecha_creacion',
      label: 'Creado',
      render: (value) =>
        value ? new Date(value as string).toLocaleDateString('es-CL') : '-',
    },
  ];

  return (
    <div>
      <CrudView
        title="Usuarios"
        columns={columns}
        data={data}
        total={total}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={(row) => remove(row.usuario_id)}
        idField="usuario_id"
      />
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={modalMode === 'create' ? 'Crear Usuario' : 'Editar Usuario'}
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
          <FormField label="RUT" required error={errors.rut?.message}>
            <Input
              {...register('rut', { required: 'El RUT es requerido' })}
              error={!!errors.rut}
              placeholder="12345678-9"
            />
          </FormField>
          <FormField label="Nombres" required error={errors.nombres?.message}>
            <Input
              {...register('nombres', { required: 'Los nombres son requeridos' })}
              error={!!errors.nombres}
            />
          </FormField>
          <div className="grid grid-cols-2 gap-m">
            <FormField
              label="Primer Apellido"
              required
              error={errors.primer_apellido?.message}
            >
              <Input
                {...register('primer_apellido', {
                  required: 'El primer apellido es requerido',
                })}
                error={!!errors.primer_apellido}
              />
            </FormField>
            <FormField label="Segundo Apellido">
              <Input {...register('segundo_apellido')} />
            </FormField>
          </div>
          <FormField
            label="Tipo de Usuario"
            required
            error={errors.tipo_usuario?.message}
          >
            <Controller
              control={control}
              name="tipo_usuario"
              rules={{ required: 'El tipo de usuario es requerido' }}
              render={({ field }) => (
                <Select
                  options={tipoUsuarioOptions}
                  value={
                    tipoUsuarioOptions.find((o) => o.value === field.value) ?? null
                  }
                  onChange={(opt: { value: string; label: string } | null) =>
                    field.onChange(opt?.value ?? '')
                  }
                  placeholder="Selecciona..."
                  error={!!errors.tipo_usuario}
                />
              )}
            />
          </FormField>
          <FormField
            label="Correo Electrónico"
            required
            error={errors.correo_electronico?.message}
          >
            <Input
              type="email"
              {...register('correo_electronico', {
                required: 'El correo es requerido',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Correo inválido',
                },
              })}
              error={!!errors.correo_electronico}
              placeholder="correo@ejemplo.cl"
            />
          </FormField>
          {modalMode === 'create' && (
            <FormField label="Contraseña" required error={errors.password?.message}>
              <Input
                type="password"
                {...register('password', {
                  required: 'La contraseña es requerida',
                })}
                error={!!errors.password}
                placeholder="********"
              />
            </FormField>
          )}
          <FormField label="Activo">
            <Toggle label="Usuario activo" {...register('activo')} />
          </FormField>
        </form>
      </Modal>
    </div>
  );
}
