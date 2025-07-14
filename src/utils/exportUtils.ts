import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// تصدير إلى PDF
export const exportToPDF = async (element: HTMLElement, filename: string): Promise<void> => {
  try {
    // تحسين جودة الصورة
    const canvas = await html2canvas(element, {
      scale: 2, // زيادة الدقة
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    
    // إنشاء ملف PDF
    const pdf = new jsPDF({
      orientation: 'landscape', // عرضي للمناظر المعمارية
      unit: 'mm',
      format: 'a4'
    });

    // حساب الأبعاد للحفاظ على النسبة
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    // حساب النسبة للاحتفاظ بالشكل الأصلي
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const scaledWidth = imgWidth * ratio;
    const scaledHeight = imgHeight * ratio;
    
    // توسيط الصورة
    const x = (pdfWidth - scaledWidth) / 2;
    const y = (pdfHeight - scaledHeight) / 2;

    // إضافة الصورة للـ PDF
    pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
    
    // حفظ الملف
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('فشل في تصدير PDF');
  }
};

// تصدير إلى PNG
export const exportToPNG = async (element: HTMLElement, filename: string): Promise<void> => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // زيادة الدقة
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    // إنشاء رابط التحميل
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    
    // تحميل الملف
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting to PNG:', error);
    throw new Error('فشل في تصدير الصورة');
  }
};

// تصدير إلى SVG (للمستقبل)
export const exportToSVG = async (element: HTMLElement, filename: string): Promise<void> => {
  try {
    // تحويل العنصر إلى SVG string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(element);
    
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = `${filename}.svg`;
    link.href = url;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to SVG:', error);
    throw new Error('فشل في تصدير SVG');
  }
};