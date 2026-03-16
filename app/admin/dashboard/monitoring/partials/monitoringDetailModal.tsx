import {Button, Modal} from 'antd';
import {ReportData} from '../types';

interface MonitoringDetailModalProps {
  open: boolean;
  viewingReport: ReportData | null;
  onClose: () => void;
}

export function MonitoringDetailModal({
  open,
  viewingReport,
  onClose,
}: MonitoringDetailModalProps) {
  return (
    <Modal
      title="Report Details"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={800}
      centered
    >
      {viewingReport && (
        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="col-span-2 md:col-span-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Maintenance
              </label>
              <p className="text-sm font-semibold text-gray-800">
                {viewingReport.maintenanceName}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                PIC
              </label>
              <p className="text-sm font-semibold text-gray-800">
                {viewingReport.picName}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Date
              </label>
              <p className="text-sm font-semibold text-gray-800">
                {viewingReport.submittedDate}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Period
              </label>
              <p className="text-sm font-semibold text-gray-800">
                {viewingReport.startDate} - {viewingReport.endDate}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Status
              </label>
              <p className="text-sm font-semibold text-[#6168FF]">
                {viewingReport.status}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Main File
              </label>
              <p className="text-sm font-semibold text-gray-800">
                {viewingReport.mainFileName}
              </p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase">
                Service Reports
              </label>
              <p className="text-sm font-semibold text-gray-800">
                {viewingReport.serviceReportCount}
              </p>
            </div>
          </div>

          <div className="space-y-4 max-h-125 overflow-y-auto pr-2 scrollbar-hide">
            {!viewingReport.adminNote && !viewingReport.revisionNote && (
              <p className="text-sm text-gray-500 italic bg-gray-50 p-6 rounded-xl text-center border border-dashed border-gray-200">
                No admin notes for this report.
              </p>
            )}

            {viewingReport.adminNote && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-xs font-bold text-emerald-700 uppercase">
                  Approval Note
                </p>
                <p className="text-sm text-emerald-900 mt-1 font-medium">
                  {viewingReport.adminNote}
                </p>
              </div>
            )}

            {viewingReport.revisionNote && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-xs font-bold text-amber-700 uppercase">
                  Revision Note
                </p>
                <p className="text-sm text-amber-900 mt-1 font-medium">
                  {viewingReport.revisionNote}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
