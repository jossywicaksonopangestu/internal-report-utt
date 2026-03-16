import {jsPDF} from 'jspdf';
import {ReportData} from '../types';

const PAGE_PADDING_X = 34;
const TOP_PADDING_Y = 36;
const PAGE_BOTTOM_Y = 806;
const HEADER_HEIGHT = 108;
const SECTION_GAP = 12;

const COLORS = {
  primary: [63, 70, 126] as const,
  primarySoft: [233, 238, 255] as const,
  textDark: [32, 38, 79] as const,
  textMuted: [110, 117, 155] as const,
  border: [217, 223, 246] as const,
  white: [255, 255, 255] as const,
  link: [32, 96, 224] as const,
};

function formatLongDate(value: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

function getStatusLabel(status: ReportData['status']): string {
  const map: Record<ReportData['status'], string> = {
    ongoing: 'Ongoing',
    pending: 'Menunggu Approval',
    approved: 'Approved',
    rejected: 'Rejected',
  };

  return map[status];
}

function sanitizeFilename(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function getMonitoringPdfFilename(report: ReportData): string {
  const safeName =
    sanitizeFilename(report.maintenanceName) || 'monitoring-report';
  return `${safeName}-${report.id}.pdf`;
}

export function createMonitoringPdf(report: ReportData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - PAGE_PADDING_X * 2;
  let cursorY = TOP_PADDING_Y;

  const ensureSpace = (requiredHeight: number, reserveForHeader = false) => {
    if (cursorY + requiredHeight <= PAGE_BOTTOM_Y) return;
    doc.addPage();
    drawPageHeader('Lampiran Monitoring MOP', reserveForHeader);
  };

  const setTextColor = (rgb: readonly [number, number, number]) => {
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  };

  const setFillColor = (rgb: readonly [number, number, number]) => {
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  };

  const setDrawColor = (rgb: readonly [number, number, number]) => {
    doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
  };

  const drawPageHeader = (title: string, compact = false) => {
    const currentHeight = compact ? 78 : HEADER_HEIGHT;
    const topY = TOP_PADDING_Y;

    setFillColor(COLORS.primarySoft);
    doc.roundedRect(
      PAGE_PADDING_X,
      topY,
      contentWidth,
      currentHeight,
      14,
      14,
      'F',
    );

    setFillColor(COLORS.primary);
    doc.roundedRect(PAGE_PADDING_X + 12, topY + 12, 172, 24, 8, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    setTextColor(COLORS.white);
    doc.text('INTERNAL REPORT UTT', PAGE_PADDING_X + 22, topY + 28);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(compact ? 16 : 20);
    setTextColor(COLORS.textDark);
    doc.text(title, PAGE_PADDING_X + 16, topY + (compact ? 54 : 62));

    if (!compact) {
      const maintenanceLines = doc.splitTextToSize(report.maintenanceName, 260);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      setTextColor(COLORS.textMuted);
      doc.text(maintenanceLines, PAGE_PADDING_X + 16, topY + 82);

      const generated = `Generated ${new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date())}`;
      doc.setFontSize(10);
      doc.text(generated, PAGE_PADDING_X + contentWidth - 206, topY + 28);
    }

    cursorY = topY + currentHeight + SECTION_GAP;
  };

  const drawSectionTitle = (title: string) => {
    ensureSpace(24, true);
    setFillColor(COLORS.primary);
    doc.roundedRect(PAGE_PADDING_X, cursorY, 7, 16, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13.5);
    setTextColor(COLORS.textDark);
    doc.text(title, PAGE_PADDING_X + 14, cursorY + 12);
    cursorY += 22;
  };

  const drawSummaryCards = () => {
    const cardGap = 10;
    const cardWidth = (contentWidth - cardGap * 2) / 3;
    const cardHeight = 62;

    ensureSpace(cardHeight, true);

    const cards = [
      {
        label: 'Status',
        value: getStatusLabel(report.status),
      },
      {
        label: 'Periode',
        value: `${formatLongDate(report.startDate)} - ${formatLongDate(report.endDate)}`,
      },
      {
        label: 'Service Report',
        value: String(report.serviceReportCount),
      },
    ];

    cards.forEach((card, index) => {
      const x = PAGE_PADDING_X + index * (cardWidth + cardGap);
      setFillColor(COLORS.white);
      setDrawColor(COLORS.border);
      doc.roundedRect(x, cursorY, cardWidth, cardHeight, 10, 10, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      setTextColor(COLORS.textMuted);
      doc.text(card.label, x + 12, cursorY + 18);

      const valueWidth = cardWidth - 24;
      const lines = doc.splitTextToSize(card.value, valueWidth);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      setTextColor(COLORS.textDark);
      doc.text(lines, x + 12, cursorY + 36);
    });

    cursorY += cardHeight + SECTION_GAP;
  };

  const drawDetailRowsBox = (rows: Array<{label: string; value: string}>) => {
    const rowGap = 8;
    const labelWidth = 132;
    const valueWidth = contentWidth - labelWidth - 44;

    const measuredRows = rows.map((row) => {
      const valueLines = doc.splitTextToSize(row.value, valueWidth);
      const rowHeight = Math.max(18, valueLines.length * 13) + rowGap;
      return {
        ...row,
        valueLines,
        rowHeight,
      };
    });

    const boxHeight =
      measuredRows.reduce((total, row) => total + row.rowHeight, 0) + 24;

    ensureSpace(boxHeight, true);
    setFillColor(COLORS.white);
    setDrawColor(COLORS.border);
    doc.roundedRect(
      PAGE_PADDING_X,
      cursorY,
      contentWidth,
      boxHeight,
      12,
      12,
      'FD',
    );

    let lineY = cursorY + 18;

    measuredRows.forEach((row, index) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      setTextColor(COLORS.textMuted);
      doc.text(row.label, PAGE_PADDING_X + 14, lineY + 10);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      setTextColor(COLORS.textDark);
      doc.text(row.valueLines, PAGE_PADDING_X + 14 + labelWidth, lineY + 10);

      lineY += row.rowHeight;

      if (index !== measuredRows.length - 1) {
        setDrawColor(COLORS.border);
        doc.line(
          PAGE_PADDING_X + 14,
          lineY - 4,
          PAGE_PADDING_X + contentWidth - 14,
          lineY - 4,
        );
      }
    });

    cursorY += boxHeight + SECTION_GAP;
  };

  const drawAttachmentCard = (
    title: string,
    fileName: string,
    fileUrl: string,
    order: number,
  ) => {
    const titleWidth = contentWidth - 74;
    const titleLines = doc.splitTextToSize(title, titleWidth);
    const fileLines = doc.splitTextToSize(`File: ${fileName}`, titleWidth);
    const cardHeight = Math.max(
      58,
      titleLines.length * 13 + fileLines.length * 12 + 30,
    );

    ensureSpace(cardHeight, true);

    setFillColor(COLORS.white);
    setDrawColor(COLORS.border);
    doc.roundedRect(
      PAGE_PADDING_X,
      cursorY,
      contentWidth,
      cardHeight,
      12,
      12,
      'FD',
    );

    setFillColor(COLORS.primarySoft);
    doc.roundedRect(PAGE_PADDING_X + 12, cursorY + 12, 24, 24, 7, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    setTextColor(COLORS.primary);
    doc.text(String(order), PAGE_PADDING_X + 21, cursorY + 28, {
      align: 'center',
    });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    setTextColor(COLORS.textDark);
    doc.text(titleLines, PAGE_PADDING_X + 44, cursorY + 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    setTextColor(COLORS.textMuted);
    doc.text(
      fileLines,
      PAGE_PADDING_X + 44,
      cursorY + 22 + titleLines.length * 13,
    );

    const linkY = cursorY + 26 + titleLines.length * 13 + fileLines.length * 12;
    if (fileUrl) {
      setTextColor(COLORS.link);
      doc.textWithLink('Buka lampiran PDF', PAGE_PADDING_X + 44, linkY, {
        url: fileUrl,
      });
    } else {
      setTextColor(COLORS.textMuted);
      doc.text('Link lampiran tidak tersedia.', PAGE_PADDING_X + 44, linkY);
    }

    cursorY += cardHeight + 8;
  };

  drawPageHeader('Monitoring MOP Report');
  drawSummaryCards();

  drawSectionTitle('Informasi Utama');
  drawDetailRowsBox([
    {label: 'Judul Maintenance', value: report.maintenanceName},
    {label: 'PIC', value: report.picName},
    {label: 'Tanggal Pengajuan', value: formatLongDate(report.submittedDate)},
    {label: 'File MOP Utama', value: report.mainFileName || '-'},
    {
      label: 'Status',
      value: getStatusLabel(report.status),
    },
    {
      label: 'Catatan Approval',
      value: report.adminNote || '-',
    },
    {
      label: 'Catatan Revisi',
      value: report.revisionNote || '-',
    },
  ]);

  drawSectionTitle('Lampiran Service Report (PDF)');

  if (report.serviceReports.length === 0) {
    drawAttachmentCard('Belum ada service report', '-', '', 1);
  } else {
    report.serviceReports.forEach((serviceReport, index) => {
      drawAttachmentCard(
        serviceReport.title?.trim() || serviceReport.fileName,
        serviceReport.fileName,
        serviceReport.fileUrl,
        index + 1,
      );
    });
  }

  const pageCount = doc.getNumberOfPages();
  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    doc.setPage(pageNumber);
    setDrawColor(COLORS.border);
    doc.line(PAGE_PADDING_X, 821, PAGE_PADDING_X + contentWidth, 821);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setTextColor(COLORS.textMuted);
    doc.text(
      `Page ${pageNumber} of ${pageCount}`,
      PAGE_PADDING_X + contentWidth,
      834,
      {
        align: 'right',
      },
    );
  }

  return doc;
}
