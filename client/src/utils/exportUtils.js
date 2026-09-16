/**
 * Utilities to export Rolodex contacts to vCard (.vcf) and CSV formats.
 */

// Export single or multiple contacts to vCard 3.0 format (.vcf)
export const exportToVCard = (contacts) => {
  const contactList = Array.isArray(contacts) ? contacts : [contacts];

  let vcfContent = '';

  contactList.forEach((c) => {
    vcfContent += 'BEGIN:VCARD\r\n';
    vcfContent += 'VERSION:3.0\r\n';
    vcfContent += `FN:${c.name}\r\n`;
    if (c.email) vcfContent += `EMAIL;TYPE=INTERNET:${c.email}\r\n`;
    if (c.phone) vcfContent += `TEL;TYPE=CELL:${c.phone}\r\n`;
    if (c.company) vcfContent += `ORG:${c.company}\r\n`;
    if (c.jobTitle) vcfContent += `TITLE:${c.jobTitle}\r\n`;
    if (c.address) vcfContent += `ADR;TYPE=HOME:;;${c.address};;;;\r\n`;
    if (c.notes) vcfContent += `NOTE:${c.notes.replace(/\n/g, '\\n')}\r\n`;
    if (c.tags && c.tags.length > 0) vcfContent += `CATEGORIES:${c.tags.join(',')}\r\n`;
    vcfContent += 'END:VCARD\r\n\r\n';
  });

  const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8;' });
  const filename =
    contactList.length === 1
      ? `${contactList[0].name.replace(/\s+/g, '_')}_Rolodex.vcf`
      : 'Rolodex_Contacts_Export.vcf';

  downloadFile(blob, filename);
};

// Export contacts to CSV format
export const exportToCSV = (contacts) => {
  const headers = ['Name', 'Email', 'Phone', 'Company', 'Job Title', 'Address', 'Tags', 'Notes', 'Favorite'];

  const rows = contacts.map((c) => [
    `"${(c.name || '').replace(/"/g, '""')}"`,
    `"${(c.email || '').replace(/"/g, '""')}"`,
    `"${(c.phone || '').replace(/"/g, '""')}"`,
    `"${(c.company || '').replace(/"/g, '""')}"`,
    `"${(c.jobTitle || '').replace(/"/g, '""')}"`,
    `"${(c.address || '').replace(/"/g, '""')}"`,
    `"${(c.tags || []).join(', ').replace(/"/g, '""')}"`,
    `"${(c.notes || '').replace(/"/g, '""')}"`,
    `"${c.isFavorite ? 'Yes' : 'No'}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, 'Rolodex_Contacts_Ledger.csv');
};

// Helper trigger browser download
function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
