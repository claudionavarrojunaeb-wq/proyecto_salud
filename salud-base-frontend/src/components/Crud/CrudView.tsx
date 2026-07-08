import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  Table,
  Button,
  ConfirmModal,
  Spinner,
  EmptyState,
  I,
} from 'junaeb-ds-kit';
import { Pencil, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export interface CrudColumn<T> {
  key: string;
  label: string;
  render?: (value: unknown, row: T) => ReactNode;
}

interface CrudViewProps<T extends object> {
  title: string;
  columns: CrudColumn<T>[];
  data: T[];
  total: number;
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onCreate?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  idField: keyof T;
  createLabel?: string;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  emptyStateType?: 'no-results' | 'no-data';
}

export function CrudView<T extends object>({
  title,
  columns,
  data,
  total,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  onCreate,
  onEdit,
  onDelete,
  idField,
  createLabel = 'Crear',
  canCreate = true,
  canEdit = true,
  canDelete = true,
  emptyStateType = 'no-data',
}: CrudViewProps<T>) {
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);

  const tableColumns = [
    ...columns,
    ...(canEdit || canDelete
      ? [
          {
            key: '_actions',
            label: '',
            render: (_value: unknown, row: T) => (
              <div className="flex items-center gap-xxs justify-end">
                {canEdit && (
                  <button
                    onClick={() => onEdit?.(row)}
                    className="p-[5px] rounded-s text-ink-500 hover:text-gob-primary hover:bg-gob-primary-light/40 transition-all duration-150"
                    title="Editar"
                  >
                    <Pencil size={14} strokeWidth={1.75} />
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={() => setDeleteTarget(row)}
                    className="p-[5px] rounded-s text-ink-500 hover:text-gob-error hover:bg-gob-error-bg transition-all duration-150"
                    title="Eliminar"
                  >
                    <Trash2 size={14} strokeWidth={1.75} />
                  </button>
                )}
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-m">
        <div className="flex items-baseline gap-s">
          <h2 className="font-display text-xl font-semibold text-ink-800">{title}</h2>
          {total > 0 && (
            <span className="text-[12px] text-ink-500 font-medium">
              {total} {total === 1 ? 'registro' : 'registros'}
            </span>
          )}
        </div>
        {canCreate && (
          <button
            onClick={onCreate}
            className="inline-flex items-center gap-xs px-m py-[8px] rounded-m bg-gob-primary text-white text-[13px] font-medium hover:bg-gob-primary-hover active:bg-gob-primary-active transition-colors duration-150 shadow-sm"
          >
            <Plus size={16} strokeWidth={2} />
            <span>{createLabel}</span>
          </button>
        )}
      </div>

      <div>
        {loading && data.length === 0 ? (
          <div className="flex justify-center items-center py-3xl">
            <Spinner size="lg" />
          </div>
        ) : data.length === 0 ? (
          <div className="py-3xl">
            <EmptyState
              type={emptyStateType}
              title={`No hay ${title.toLowerCase()}`}
              description={`No se encontraron registros de ${title.toLowerCase()}.`}
              action={canCreate ? createLabel : undefined}
              onAction={canCreate ? onCreate : undefined}
            />
          </div>
        ) : (
          <Table
            columns={tableColumns}
            rows={data}
            total={total}
            loading={loading}
            pageSize={20}
            sortable
            filterable
          />
        )}
      </div>

      {totalPages > 1 && data.length > 0 && (
        <div className="flex items-center justify-between mt-m">
          <p className="text-[12px] text-ink-500">
            Página <span className="font-semibold text-ink-700">{currentPage}</span> de{' '}
            <span className="font-semibold text-ink-700">{totalPages}</span>
          </p>
          <div className="flex items-center gap-xs">
            <button
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="inline-flex items-center gap-xxs px-s py-[7px] rounded-m border border-ink-200 text-[12px] font-medium text-ink-600 hover:bg-ink-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} strokeWidth={1.75} />
              <span>Anterior</span>
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="inline-flex items-center gap-xxs px-s py-[7px] rounded-m border border-ink-200 text-[12px] font-medium text-ink-600 hover:bg-ink-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span>Siguiente</span>
              <ChevronRight size={14} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            onDelete?.(deleteTarget);
            setDeleteTarget(null);
          }}
          title={`Eliminar ${title.toLowerCase()}`}
          message="Esta acción no se puede deshacer. ¿Seguro que deseas continuar?"
          confirmLabel="Eliminar"
          cancelLabel="Cancelar"
          variant="danger"
        />
      )}
    </div>
  );
}
