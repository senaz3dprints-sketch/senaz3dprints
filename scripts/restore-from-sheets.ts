import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentField = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentField.trim());
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(currentField.trim());
      if (row.some((field) => field.length > 0)) {
        lines.push(row);
      }
      row = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField || row.length > 0) {
    row.push(currentField.trim());
    if (row.some((field) => field.length > 0)) {
      lines.push(row);
    }
  }

  return lines;
}

export async function restoreFromSheetUrl(sheetUrlOrId: string) {
  let sheetId = sheetUrlOrId.trim();
  const match = sheetUrlOrId.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match) sheetId = match[1];

  console.log(`\nStarting Google Sheets Restore for Spreadsheet ID: ${sheetId}...`);

  // 1. Restore Orders
  const ordersCsvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Orders`;
  try {
    const res = await fetch(ordersCsvUrl);
    if (res.ok) {
      const csvText = await res.text();
      const rows = parseCSV(csvText);
      console.log(`\nFound ${rows.length - 1} rows in 'Orders' tab.`);

      let importedOrders = 0;
      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        const [
          id,
          dateStr,
          customerName,
          whatsapp,
          email,
          fullAddress,
          itemsSummary,
          subtotalStr,
          discountStr,
          totalStr,
          couponCode,
          referralCode,
          notes,
          status,
        ] = r;

        if (!id || !customerName) continue;

        const totalAmount = parseFloat((totalStr || '0').replace(/[^0-9.]/g, '')) || 0;
        const discountAmount = parseFloat((discountStr || '0').replace(/[^0-9.]/g, '')) || 0;
        const subtotal = parseFloat((subtotalStr || '0').replace(/[^0-9.]/g, '')) || totalAmount;

        let address = fullAddress || '';
        let city = '';
        let state = '';
        let pincode = '';

        const pinMatch = address.match(/-\s*(\d{6})/);
        if (pinMatch) pincode = pinMatch[1];

        const itemsJson = JSON.stringify([
          {
            name: itemsSummary || '3D Printed Product',
            quantity: 1,
            price: totalAmount,
            total: totalAmount,
          },
        ]);

        await prisma.order.upsert({
          where: { id },
          update: {
            customerName: customerName || 'Valued Customer',
            whatsapp: whatsapp || '',
            email: email === 'N/A' ? null : email,
            address: address,
            city: city,
            state: state,
            pincode: pincode,
            orderNotes: notes === 'None' ? null : notes,
            items: itemsJson,
            subtotal,
            discountAmount,
            totalAmount,
            couponCode: couponCode === 'None' ? null : couponCode,
            referralCode: referralCode === 'None' ? null : referralCode,
            status: status || 'PENDING',
          },
          create: {
            id,
            customerName: customerName || 'Valued Customer',
            whatsapp: whatsapp || '',
            email: email === 'N/A' ? null : email,
            address: address,
            city: city,
            state: state,
            pincode: pincode,
            orderNotes: notes === 'None' ? null : notes,
            items: itemsJson,
            subtotal,
            discountAmount,
            totalAmount,
            couponCode: couponCode === 'None' ? null : couponCode,
            referralCode: referralCode === 'None' ? null : referralCode,
            status: status || 'PENDING',
          },
        });
        importedOrders++;
      }
      console.log(`✔ Successfully restored ${importedOrders} Orders into database!`);
    } else {
      console.error(`Could not fetch Orders tab (HTTP ${res.status}). Make sure sheet sharing is set to 'Anyone with link can view'.`);
    }
  } catch (err: any) {
    console.error('Error importing orders:', err.message);
  }

  // 2. Restore Custom Requests
  const customCsvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=CustomRequests`;
  try {
    const res = await fetch(customCsvUrl);
    if (res.ok) {
      const csvText = await res.text();
      const rows = parseCSV(csvText);
      console.log(`\nFound ${rows.length - 1} rows in 'CustomRequests' tab.`);

      let importedRequests = 0;
      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        const [
          id,
          dateStr,
          customerName,
          whatsapp,
          email,
          productType,
          material,
          color,
          quantityStr,
          dimensions,
          fileUrl,
          referenceImageUrl,
          additionalNotes,
          status,
        ] = r;

        if (!id || !customerName) continue;

        const quantity = parseInt(quantityStr || '1') || 1;

        await prisma.customRequest.upsert({
          where: { id },
          update: {
            customerName: customerName || 'Customer',
            whatsapp: whatsapp || '',
            email: email === 'N/A' ? null : email,
            productType: productType || 'Custom 3D Print',
            materialPreference: material || 'PLA+',
            colorPreference: color || 'White',
            quantity,
            dimensions: dimensions === 'N/A' ? null : dimensions,
            fileUrl: fileUrl === 'N/A' ? null : fileUrl,
            referenceImageUrl: referenceImageUrl === 'N/A' ? null : referenceImageUrl,
            additionalNotes: additionalNotes === 'None' ? null : additionalNotes,
            status: status || 'PENDING',
          },
          create: {
            id,
            customerName: customerName || 'Customer',
            whatsapp: whatsapp || '',
            email: email === 'N/A' ? null : email,
            productType: productType || 'Custom 3D Print',
            materialPreference: material || 'PLA+',
            colorPreference: color || 'White',
            quantity,
            dimensions: dimensions === 'N/A' ? null : dimensions,
            fileUrl: fileUrl === 'N/A' ? null : fileUrl,
            referenceImageUrl: referenceImageUrl === 'N/A' ? null : referenceImageUrl,
            additionalNotes: additionalNotes === 'None' ? null : additionalNotes,
            status: status || 'PENDING',
          },
        });
        importedRequests++;
      }
      console.log(`✔ Successfully restored ${importedRequests} Custom Requests into database!`);
    } else {
      console.error(`Could not fetch CustomRequests tab (HTTP ${res.status}).`);
    }
  } catch (err: any) {
    console.error('Error importing custom requests:', err.message);
  }

  await prisma.$disconnect();
  console.log('\n✨ Restore completed successfully!');
}

const inputArg = process.argv[2];
if (inputArg) {
  restoreFromSheetUrl(inputArg);
}
