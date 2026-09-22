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
      console.log(`No 'CustomRequests' tab found or not public.`);
    }
  } catch (err: any) {
    console.error('Error importing custom requests:', err.message);
  }

  // 3. Restore Products
  const productsCsvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Products`;
  try {
    const res = await fetch(productsCsvUrl);
    if (res.ok) {
      const csvText = await res.text();
      const rows = parseCSV(csvText);
      console.log(`\nFound ${rows.length - 1} rows in 'Products' tab.`);

      let importedProducts = 0;
      for (let i = 1; i < rows.length; i++) {
        const r = rows[i];
        const [
          name,
          categoryName,
          priceStr,
          comparePriceStr,
          shortDesc,
          fullDesc,
          imagesStr,
          colorsStr,
          sizesStr,
          material,
          stockStr,
          personalizationStr,
          tagsStr,
        ] = r;

        if (!name) continue;

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const price = parseFloat((priceStr || '0').replace(/[^0-9.]/g, '')) || 299;
        const compareAtPrice = comparePriceStr ? parseFloat(comparePriceStr.replace(/[^0-9.]/g, '')) : null;
        const stockQuantity = parseInt(stockStr || '20') || 20;

        // Ensure category exists
        const catName = categoryName || 'Custom 3D Prints';
        const catSlug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        let category = await prisma.category.findUnique({ where: { slug: catSlug } });
        if (!category) {
          category = await prisma.category.create({
            data: {
              name: catName,
              slug: catSlug,
              description: `Custom ${catName} collection`,
            },
          });
        }

        const images = imagesStr
          ? imagesStr.split(',').map((u) => u.trim()).filter(Boolean)
          : ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'];

        const colors = colorsStr ? colorsStr.split(',').map((c) => c.trim()).filter(Boolean) : ['White', 'Black'];
        const sizes = sizesStr ? sizesStr.split(',').map((s) => s.trim()).filter(Boolean) : ['Standard'];
        const tags = tagsStr ? tagsStr.split(',').map((t) => t.trim()).filter(Boolean) : ['3D Print'];
        const isPersonalized = String(personalizationStr).toLowerCase().includes('true') || String(personalizationStr).toLowerCase().includes('yes');

        await prisma.product.upsert({
          where: { slug },
          update: {
            name,
            categoryId: category.id,
            price,
            compareAtPrice,
            shortDescription: shortDesc || name,
            fullDescription: fullDesc || shortDesc || name,
            images: JSON.stringify(images),
            colors: JSON.stringify(colors),
            sizes: JSON.stringify(sizes),
            material: material || 'PLA+',
            stockQuantity,
            personalizationEnabled: isPersonalized,
            customTextEnabled: isPersonalized,
            tags: JSON.stringify(tags),
            isPublished: true,
          },
          create: {
            name,
            slug,
            categoryId: category.id,
            price,
            compareAtPrice,
            shortDescription: shortDesc || name,
            fullDescription: fullDesc || shortDesc || name,
            images: JSON.stringify(images),
            colors: JSON.stringify(colors),
            sizes: JSON.stringify(sizes),
            material: material || 'PLA+',
            stockQuantity,
            personalizationEnabled: isPersonalized,
            customTextEnabled: isPersonalized,
            tags: JSON.stringify(tags),
            isPublished: true,
          },
        });
        importedProducts++;
      }
      console.log(`✔ Successfully restored ${importedProducts} Products from 'Products' tab into database!`);
    } else {
      console.log(`No 'Products' tab found in Google Sheet (Optional).`);
    }
  } catch (err: any) {
    console.error('Error importing products tab:', err.message);
  }

  await prisma.$disconnect();
  console.log('\n✨ Restore completed successfully!');
}

const inputArg = process.argv[2];
if (inputArg) {
  restoreFromSheetUrl(inputArg);
}

