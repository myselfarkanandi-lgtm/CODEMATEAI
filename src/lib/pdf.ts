import { jsPDF } from 'jspdf';
import { AssignmentResultData, User } from '../types/index.ts';

export function generateAssignmentPDF(assignment: any, user?: User | null) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 20;

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('CODEMATE AI — ASSIGNMENT REPORT', 14, 14);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Solve. Learn. Practice. Improve. | Academic AI Assistant', 14, 22);

  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.text(`Date: ${dateStr}`, pageWidth - 45, 14);

  y = 38;
  doc.setTextColor(15, 23, 42);

  // Student Meta Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, pageWidth - 28, 20, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Student: ${user?.name || 'Arka Nandi'}`, 18, y + 8);
  doc.text(`Course: ${user?.course || 'B.Pharm'} (Sem ${user?.semester || 1})`, 18, y + 15);
  doc.text(`Language: ${(assignment.language || 'C').toUpperCase()}`, pageWidth / 2 + 10, y + 8);
  doc.text(`Subject: ${assignment.subject || 'Programming'}`, pageWidth / 2 + 10, y + 15);

  y += 28;

  // Question Section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('QUESTION:', 14, y);
  y += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const questionLines = doc.splitTextToSize(assignment.question, pageWidth - 28);
  doc.text(questionLines, 14, y);
  y += questionLines.length * 5 + 6;

  // Check page break
  const checkBreak = (needed: number) => {
    if (y + needed > pageHeight - 15) {
      doc.addPage();
      y = 20;
    }
  };

  // Algorithm Section
  if (assignment.algorithm) {
    checkBreak(20);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('ALGORITHM:', 14, y);
    y += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const algoStr = Array.isArray(assignment.algorithm) ? assignment.algorithm.join('\n') : String(assignment.algorithm);
    const algoLines = doc.splitTextToSize(algoStr, pageWidth - 28);
    doc.text(algoLines, 14, y);
    y += algoLines.length * 4.5 + 8;
  }

  // Source Code Section
  if (assignment.code) {
    checkBreak(35);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('SOURCE CODE:', 14, y);
    y += 6;

    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    const codeLines = doc.splitTextToSize(assignment.code, pageWidth - 32);

    // Gray background for code block
    const blockHeight = Math.min(codeLines.length * 4 + 6, pageHeight - y - 20);
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, y, pageWidth - 28, blockHeight, 2, 2, 'F');

    doc.text(codeLines.slice(0, 35), 18, y + 5);
    y += blockHeight + 8;
    doc.setFont('helvetica', 'normal');
  }

  // Explanation Section
  if (assignment.explanation) {
    checkBreak(20);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('EXPLANATION:', 14, y);
    y += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const expLines = doc.splitTextToSize(assignment.explanation, pageWidth - 28);
    doc.text(expLines, 14, y);
    y += expLines.length * 4.5 + 8;
  }

  // Sample Input & Output
  if (assignment.sampleInput || assignment.sampleOutput) {
    checkBreak(20);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('SAMPLE EXECUTION:', 14, y);
    y += 6;
    doc.setFontSize(9);
    doc.setFont('courier', 'normal');
    if (assignment.sampleInput) {
      doc.text(`Input:  ${assignment.sampleInput}`, 14, y);
      y += 5;
    }
    if (assignment.sampleOutput) {
      const outLines = doc.splitTextToSize(`Output: ${assignment.sampleOutput}`, pageWidth - 28);
      doc.text(outLines, 14, y);
      y += outLines.length * 4.5 + 6;
    }
    doc.setFont('helvetica', 'normal');
  }

  // Viva Questions
  if (assignment.vivaQuestions && assignment.vivaQuestions.length > 0) {
    checkBreak(25);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('VIVA QUESTIONS FOR LAB EXAM:', 14, y);
    y += 6;
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    assignment.vivaQuestions.forEach((q: any, idx: number) => {
      checkBreak(8);
      const qLines = doc.splitTextToSize(`${idx + 1}. ${q}`, pageWidth - 28);
      doc.text(qLines, 14, y);
      y += qLines.length * 4 + 2;
    });
  }

  // Footer on all pages
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 25, pageHeight - 8);
    doc.text('Generated by CodeMate AI — Academic Personalized Learning Platform', 14, pageHeight - 8);
  }

  // Save PDF
  const filename = `CodeMate_Assignment_${(assignment.question.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')) || 'Solution'}.pdf`;
  doc.save(filename);

  // Record download in API
  fetch('/api/downloads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('codemate_token') || ''}`,
    },
    body: JSON.stringify({
      downloadType: 'assignment',
      resourceId: assignment.id || 'res_' + Date.now(),
      title: assignment.question.slice(0, 60),
      format: 'PDF',
    }),
  }).catch(() => {});
}
