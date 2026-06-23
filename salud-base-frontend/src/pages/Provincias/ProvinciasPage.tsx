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
} from '@pacifico/ui-kit';
import { useCrud } from '../../hooks/use-crud';
import { CrudView, type CrudColumn } from '../../components/Crud';
import api from '../../lib/axios';
import type { Provincia, Region } from '../../types';

interface ProvinciaFormData {
  codigo: string;
  nombre: string;
  region_id: string;
  activo: boolean;
}

export function ProvinciasPage() {
  const { data, total, totalPages, loading, currentPage, create, update, remove, setPage } =
    useCrud<Provincia>({ endpoint: '/provincias' });
  const { show } = useSnackbar();
  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [regiones, setRegiones] = useState<{ value: string; label: string }[]>([]);
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } =
    useForm<ProvinciaFormData>();

  useEffect(() => {
    api.get('/regiones', { params: { limit: 100 } }).then(({ data }) => {
      setRegiones(data.data.map((r: Region) => ({ value: String(r.region_id), label: r.nombre })));
    });
  }, []);

  const regionId = watch('region_id');
  const selectedRegion = regiones.find((r) => r.value === String(regionId ?? '')) ?? null;

  const handleCreate = () => {
    setModalMode('create');
    setEditingId(null);
    reset({ activo: true } as ProvinciaFormData);
    setOpenModal(true);
  };

  const handleEdit = (row: Provincia) => {
    setModalMode('edit');
    setEditingId(row.provincia_id);
    reset(row as unknown as ProvinciaFormData);
    setOpenModal(true);
  };

  const onSubmit = async (formData: ProvinciaFormData) => {
    try {
      const payload = { ...formData, region_id: Number(formData.region_id) };
      if (modalMode === 'create') {
        await create(payload);
        show('Provincia creada correctamente', { type: 'success' });
      } else {
        await update(editingId!, payload);
        show('Provincia actualizada correctamente', { type: 'success' });
      }
      setOpenModal(false);
    } catch {
      show('Error al guardar la provincia', { type: 'error' });
    }
  };

  const columns: CrudColumn<Provincia>[] = [
    { key: 'codigo', label: 'Código' },
    { key: 'nombre', label: 'Nombre' },
    {
      key: 'region_id',
      label: 'Región',
      render: (_value, row) =>
        row.Regiones?.nombre ?? regiones.find((r) => r.value === String(row.region_id))?.label ?? '-',
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
        title="Provincias"
        columns={columns}
        data={data}
        total={total}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={(row) => remove(row.provincia_id)}
        idField="provincia_id"
      />
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={modalMode === 'create' ? 'Crear Provincia' : 'Editar Provincia'}
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
              placeholder="131"
            />
          </FormField>
          <FormField label="Nombre" required error={errors.nombre?.message}>
            <Input
              {...register('nombre', { required: 'El nombre es requerido' })}
              error={!!errors.nombre}
              placeholder="Santiago"
            />
          </FormField>
          <FormField label="Región" required error={errors.region_id?.message}>
            <input
              type="hidden"
              {...register('region_id', { required: 'La región es requerida' })}
            />
            <Select
              options={regiones}
              value={selectedRegion}
              onChange={(selected: { value: string; label: string } | null) =>
                setValue('region_id', selected?.value ?? '', { shouldValidate: true })
              }
              placeholder="Selecciona una región"
            />
          </FormField>
          <FormField label="Activo">
            <Toggle label="Provincia activa" {...register('activo')} />
          </FormField>
        </form>
      </Modal>
    </div>
  );
}
