import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import type { PaginatedResponse, PaginationParams } from '../types';

interface UseCrudOptions {
  endpoint: string;
  page?: number;
  limit?: number;
  filters?: Record<string, unknown>;
}

export function useCrud<T>({ endpoint, page = 1, limit = 20, filters }: UseCrudOptions) {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(page);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: PaginationParams & Record<string, unknown> = {
        page: currentPage,
        limit,
        ...filters,
      };
      const { data: response } = await api.get<PaginatedResponse<T>>(endpoint, { params });
      setData(response.data);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar datos';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, currentPage, limit, JSON.stringify(filters)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const create = async (payload: Partial<T>): Promise<T> => {
    const { data: created } = await api.post<T>(endpoint, payload);
    await fetchData();
    return created;
  };

  const update = async (id: number | string, payload: Partial<T>): Promise<T> => {
    const { data: updated } = await api.patch<T>(`${endpoint}/${id}`, payload);
    await fetchData();
    return updated;
  };

  const remove = async (id: number | string): Promise<void> => {
    await api.delete(`${endpoint}/${id}`);
    await fetchData();
  };

  const setPage = (p: number) => setCurrentPage(p);

  return {
    data,
    total,
    totalPages,
    loading,
    error,
    currentPage,
    create,
    update,
    remove,
    setPage,
    refresh: fetchData,
  };
}
