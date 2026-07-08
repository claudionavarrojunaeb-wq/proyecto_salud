import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Modal,
  FormField,
  Input,
  Button,
  Toggle,
  StatusBadge,
  Select,
  useSnackbar,
} from 'junaeb-ds-kit';
import { useCrud } from '../../hooks/use-crud';
import { CrudView, type CrudColumn } from '../../components/Crud';
import api from '../../lib/axios';
import type { Comuna, Provincia } from '../../types';

interface ComunaFormData {
  codigo: string;
  nombre: string;
  provincia_id: string;
  activo: boolean;
}

export function ComunasPage() {
  const { data, total, totalPages, loading, currentPage, create, update, remove, setPage } =
    useCrud<Comuna>({ endpoint: '/comunas' });
  const { show } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [provincias, setProvincias] = useState<{ value: string; label: string }[]>([]);
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } =
    useForm<ComunaFormData>();

  useEffect(() => {
    api.get('/provincias', { params: { limit: 100 } }).then(({ data }) => {
      setProvincias(data.data.map((p: Provincia) => ({ value: String(p.provincia_id), label: p.nombre })));
    });
  }, []);

  const provinciaId = watch('provincia_id');
  const selectedProvincia = provincias.find((p) => p.value === String(provinciaId ?? '')) ?? null;

  const handleCreate = () => {
    setModalMode('create');
    setEditingId(null);
    reset({ activo: true } as ComunaFormData);
    setOpenModal(true);
  };

  const handleEdit = (row: Comuna) => {
    setModalMode('edit');
    setEditingId(row.comuna_id);
    reset(row as unknown as ComunaFormData);
    setOpenModal(true);
  };

  const onSubmit = async (formData: ComunaFormData) => {
    try {
      const payload = { ...formData, provincia_id: Number(formData.provincia_id) };
      if (modalMode === 'create') {
        await create(payload);
        show('Comuna creada correctamente', { type: 'success' });
      } else {
        await update(editingId!, payload);
        show('Comuna actualizada correctamente', { type: 'success' });
      }
      setOpenModal(false);
    } catch {
      show('Error al guardar la comuna', { type: 'error' });
    }
  };

  const columns: CrudColumn<Comuna>[] = [
    { key: 'codigo', label: 'Código' },
    { key: 'nombre', label: 'Nombre' },
    {
      key: 'provincia_id',
      label: 'Provincia',
      render: (_value, row) =>
        row.Provincias?.nombre ?? provincias.find((p) => p.value === String(row.provincia_id))?.label ?? '-',
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
        title="Comunas"
        columns={columns}
        data={data}
        total={total}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={(row) => remove(row.comuna_id)}
        idField="comuna_id"
      />
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={modalMode === 'create' ? 'Crear Comuna' : 'Editar Comuna'}
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
              placeholder="13101"
            />
          </FormField>
          <FormField label="Nombre" required error={errors.nombre?.message}>
            <Input
              {...register('nombre', { required: 'El nombre es requerido' })}
              error={!!errors.nombre}
              placeholder="Santiago Centro"
            />
          </FormField>
          <FormField label="Provincia" required error={errors.provincia_id?.message}>
            <input
              type="hidden"
              {...register('provincia_id', { required: 'La provincia es requerida' })}
            />
            <Select
              options={provincias}
              value={selectedProvincia}
              onChange={(selected: { value: string; label: string } | null) =>
                setValue('provincia_id', selected?.value ?? '', { shouldValidate: true })
              }
              placeholder="Selecciona una provincia"
            />
          </FormField>
          <FormField label="Activo">
            <Toggle label="Comuna activa" {...register('activo')} />
          </FormField>
        </form>
      </Modal>
    </div>
  );
}
