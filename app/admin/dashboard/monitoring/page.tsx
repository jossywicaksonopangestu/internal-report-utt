'use client';

import {useMemo, useState} from 'react';
import {Pagination, Spin} from 'antd';
import {useMonitoring} from './hooks/useMonitoring';
import {
  MonitoringTopSection,
  StatusFilter,
} from './partials/monitoringTopSection';
import {MonitoringReportCard} from './partials/monitoringReportCard';

const PAGE_SIZE = 8;

export default function MonitoringPage() {
  const {data, isLoading} = useMonitoring();

  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const summary = useMemo(() => {
    const pending = data.filter((item) => item.status === 'pending').length;
    const approved = data.filter((item) => item.status === 'approved').length;
    const rejected = data.filter((item) => item.status === 'rejected').length;
    const ongoing = data.filter((item) => item.status === 'ongoing').length;

    return {
      total: data.length,
      ongoing,
      pending,
      approved,
      rejected,
    };
  }, [data]);

  const filteredData = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return data.filter((item) => {
      const matchesStatus =
        selectedStatus === 'all' || item.status === selectedStatus;

      const matchesKeyword =
        !keyword ||
        item.maintenanceName.toLowerCase().includes(keyword) ||
        item.picName.toLowerCase().includes(keyword) ||
        item.mainFileName.toLowerCase().includes(keyword);

      return matchesStatus && matchesKeyword;
    });
  }, [data, searchKeyword, selectedStatus]);

  const handleSearchKeywordChange = (value: string) => {
    setSearchKeyword(value);
    setCurrentPage(1);
  };

  const handleSelectStatus = (status: StatusFilter) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredData.slice(start, start + PAGE_SIZE);
  }, [filteredData, currentPage]);

  return (
    <div className="mx-auto flex w-full max-w-370 flex-col pb-10 text-[#1F2559]">
      <MonitoringTopSection
        summary={summary}
        searchKeyword={searchKeyword}
        onSearchKeywordChange={handleSearchKeywordChange}
        selectedStatus={selectedStatus}
        onSelectStatus={handleSelectStatus}
      />

      <section className="mt-4 space-y-3">
        {isLoading && (
          <div className="flex h-60 items-center justify-center rounded-2xl bg-white/65">
            <Spin size="large" />
          </div>
        )}

        {!isLoading && filteredData.length === 0 && (
          <div className="rounded-2xl bg-white px-5 py-12 text-center text-sm text-[#616A95] shadow-md">
            Tidak ada data monitoring yang sesuai.
          </div>
        )}

        {!isLoading &&
          paginatedData.map((item) => (
            <MonitoringReportCard key={item.id} item={item} />
          ))}

        {!isLoading && filteredData.length > 0 && (
          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={filteredData.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            className="mt-5! flex justify-center"
          />
        )}
      </section>
    </div>
  );
}
