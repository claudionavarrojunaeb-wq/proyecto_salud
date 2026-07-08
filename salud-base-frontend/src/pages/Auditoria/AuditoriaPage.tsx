import { Tabs } from 'junaeb-ds-kit';
import { useCrud } from '../../hooks/use-crud';
import { CrudView, type CrudColumn } from '../../components/Crud';
import type { AuditoriaAcceso, AuditLog } from '../../types';

export function AuditoriaPage() {
  const {
    data: accesosData,
    total: accesosTotal,
    totalPages: accesosTotalPages,
    loading: accesosLoading,
    currentPage: accesosPage,
    setPage: setAccesosPage,
  } = useCrud<AuditoriaAcceso>({ endpoint: '/auditoria/accesos' });

  const {
    data: logsData,
    total: logsTotal,
    totalPages: logsTotalPages,
    loading: logsLoading,
    currentPage: logsPage,
    setPage: setLogsPage,
  } = useCrud<AuditLog>({ endpoint: '/auditoria/logs' });

  const accesosColumns: CrudColumn<AuditoriaAcceso>[] = [
    {
      key: 'fecha_evento',
      label: 'Fecha',
      render: (_v, row) => new Date(row.fecha_evento).toLocaleString('es-CL'),
    },
    { key: 'tipo_evento', label: 'Tipo Evento' },
    { key: 'input_login', label: 'Login' },
    { key: 'direccion_ip', label: 'Dirección IP' },
    { key: 'detalle', label: 'Detalle' },
  ];

  const logsColumns: CrudColumn<AuditLog>[] = [
    {
      key: 'createdAt',
      label: 'Fecha',
      render: (_v, row) => new Date(row.createdAt).toLocaleString('es-CL'),
    },
    { key: 'tableName', label: 'Tabla' },
    { key: 'action', label: 'Acción' },
    { key: 'recordId', label: 'ID Registro' },
    { key: 'userId', label: 'Usuario' },
    { key: 'ipAddress', label: 'Dirección IP' },
  ];

  const tabs = [
    {
      label: 'Accesos',
      content: (
        <CrudView
          title="Accesos"
          columns={accesosColumns}
          data={accesosData}
          total={accesosTotal}
          loading={accesosLoading}
          currentPage={accesosPage}
          totalPages={accesosTotalPages}
          onPageChange={setAccesosPage}
          idField="log_id"
          canCreate={false}
          canEdit={false}
          canDelete={false}
          emptyStateType="no-data"
        />
      ),
    },
    {
      label: 'Logs de Cambios',
      content: (
        <CrudView
          title="Logs de Cambios"
          columns={logsColumns}
          data={logsData}
          total={logsTotal}
          loading={logsLoading}
          currentPage={logsPage}
          totalPages={logsTotalPages}
          onPageChange={setLogsPage}
          idField="id"
          canCreate={false}
          canEdit={false}
          canDelete={false}
          emptyStateType="no-data"
        />
      ),
    },
  ];

  return (
    <div className="space-y-l">
      {/* <div>
        <h1 className="font-display text-3xl font-bold text-ink-800 mb-xs tracking-tight">
          Auditoría
        </h1>
        <p className="text-ink-500 text-[14px]">
          Registros de accesos y cambios en el sistema
        </p>
      </div> */}

      <Tabs tabs={tabs} />
    </div>
  );
}
