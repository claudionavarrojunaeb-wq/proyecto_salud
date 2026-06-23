import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
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
import api from '../../lib/axios';
import type { Prestador, Comuna, PaginatedResponse } from '../../types';

interface ComunaOption {
  value: number;
  label: string;
}

interface PrestadorFormData {
  rut: string;
  razon_social: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  activo: boolean;
}

export function PrestadoresPage() {
  const {
    data,
    total,
    totalPages,
    loading,
    currentPage,
    create,
    update,
    remove,
    setPage,
  } = useCrud<Prestador>({ endpoint: '/prestadores' });
  const { show } = useSnackbar();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Prestador | null>(null);
  const [comunaOptions, setComunaOptions] = useState<ComunaOption[]>([]);
  const [selectedComuna, setSelectedComuna] = useState<ComunaOption | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
  } = useForm<PrestadorFormData>({
    defaultValues: { activo: true },
  });
  const activoValue = watch('activo');

  useEffect(() => {
    api
      .get<PaginatedResponse<Comuna>>('/comunas', { params: { limit: 500 } })
      .then(({ data: resp }) => {
        setComunaOptions(
          resp.data.map((c) => ({ value: c.comuna_id, label: c.nombre })),
        );
      })
      .catch(() => {
        show('Error al cargar comunas', { type: 'error' });
      });
  }, [show]);

  const openCreate = () => {
    setEditing(null);
    reset({
      rut: '',
      razon_social: '',
      direccion: '',
      telefono: '',
      email: '',
      activo: true,
    });
    setSelectedComuna(null);
    setModalOpen(true);
  };

  const openEdit = (row: Prestador) => {
    setEditing(row);
    reset({
      rut: row.rut,
      razon_social: row.razon_social,
      direccion: row.direccion ?? '',
      telefono: row.telefono ?? '',
      email: row.email ?? '',
      activo: row.activo,
    });
    setSelectedComuna(
      comunaOptions.find((o) => o.value === row.comuna_id) ?? null,
    );
    setModalOpen(true);
  };

  const onSubmit = async (formData: PrestadorFormData) => {
    setSaving(true);
    try {
      const payload: Partial<Prestador> = {
        rut: formData.rut,
        razon_social: formData.razon_social,
        direccion: formData.direccion || undefined,
        comuna_id: selectedComuna?.value,
        telefono: formData.telefono || undefined,
        email: formData.email || undefined,
        activo: formData.activo,
      };
      if (editing) {
        await update(editing.prestador_id, payload);
        show('Prestador actualizado', { type: 'success' });
      } else {
        await create(payload);
        show('Prestador creado', { type: 'success' });
      }
      setModalOpen(false);
    } catch {
      show('Error al guardar prestador', { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: Prestador) => {
    try {
      await remove(row.prestador_id);
      show('Prestador eliminado', { type: 'success' });
    } catch {
      show('Error al eliminar prestador', { type: 'error' });
    }
  };

  const columns: CrudColumn<Prestador>[] = [
    { key: 'rut', label: 'RUT' },
    { key: 'razon_social', label: 'Razón Social' },
    { key: 'email', label: 'Email' },
    { key: 'telefono', label: 'Teléfono' },
    {
      key: 'comuna',
      label: 'Comuna',
      render: (_v, row) => row.Comunas?.nombre ?? '-',
    },
    {
      key: 'activo',
      label: 'Estado',
      render: (_v, row) => (
        <StatusBadge variant={row.activo ? 'success' : 'neutral'}>
          {row.activo ? 'Activo' : 'Inactivo'}
        </StatusBadge>
      ),
    },
  ];

  return (
    <div className="space-y-l">
      {/* <div>
        <h1 className="font-display text-3xl font-bold text-ink-800 mb-xs tracking-tight">
          Prestadores
        </h1>
        <p className="text-ink-500 text-[14px]">Gestión de prestadores de salud</p>
      </div> */}

      <CrudView
        title="Prestadores"
        columns={columns}
        data={data}
        total={total}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
        onCreate={openCreate}
        onEdit={openEdit}
        onDelete={handleDelete}
        idField="prestador_id"
        createLabel="Crear prestador"
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Editar Prestador' : 'Crear Prestador'}
        size="lg"
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
              {editing ? 'Guardar' : 'Crear'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-m">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-m">
            <FormField label="RUT" required>
              <Input {...register('rut')} placeholder="12345678-9" />
            </FormField>
            <FormField label="Razón Social" required>
              <Input
                {...register('razon_social')}
                placeholder="Nombre o razón social"
              />
            </FormField>
            <FormField label="Dirección">
              <Input {...register('direccion')} placeholder="Dirección" />
            </FormField>
            <FormField label="Comuna">
              <Select
                options={comunaOptions}
                value={selectedComuna}
                onChange={(opt: ComunaOption | null) => {
                  setSelectedComuna(opt);
                }}
                isClearable
                placeholder="Selecciona una comuna"
              />
            </FormField>
            <FormField label="Teléfono">
              <Input {...register('telefono')} placeholder="+56 2 1234 5678" />
            </FormField>
            <FormField label="Email">
              <Input
                {...register('email')}
                type="email"
                placeholder="correo@ejemplo.cl"
              />
            </FormField>
          </div>
          <FormField label="Estado">
            <Toggle
              label={activoValue ? 'Activo' : 'Inactivo'}
              {...register('activo')}
            />
          </FormField>
        </form>
      </Modal>
    </div>
  );
}
