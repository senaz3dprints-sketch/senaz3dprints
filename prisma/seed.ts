import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SenAZ 3D PRINTS database...');

  // 1. Create Default Admin User
  const passwordHash = await bcrypt.hash('admin_senaz_pass', 10);
  await prisma.adminUser.upsert({
    where: { username: 'admin' },
    update: { password: passwordHash },
    create: {
      username: 'admin',
      password: passwordHash,
    },
  });
  console.log('✔ Admin user initialized (Username: admin)');

  // 2. Create Categories
  const categoriesData = [
    {
      name: 'Personalised',
      slug: 'personalised',
      description: 'Custom nameplates, engraved tags, personalized desk objects and gifts.',
      image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80',
      displayOrder: 1,
    },
    {
      name: 'Keychains',
      slug: 'keychains',
      description: 'Custom text keychains, lithophanes, monogram tags, and fidget keyrings.',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      displayOrder: 2,
    },
    {
      name: 'Figures & Statues',
      slug: 'figures',
      description: 'Low-poly statues, detailed anime characters, and decorative desk figures.',
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
      displayOrder: 3,
    },
    {
      name: 'Decor',
      slug: 'decor',
      description: 'Architectural lamps, voronoi vases, geometric wall art, and ambient lighting.',
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
      displayOrder: 4,
    },
    {
      name: 'Desk & Utility',
      slug: 'desk-utility',
      description: 'Cable management solutions, phone stands, headphone hangers, and tool organizers.',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
      displayOrder: 5,
    },
    {
      name: 'Custom Prints',
      slug: 'custom-prints',
      description: 'Bring your custom 3D model STL files to life with industrial FDM precision.',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      displayOrder: 6,
    },
  ];

  const categories: Record<string, any> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categories[cat.slug] = created;
  }
  console.log('✔ Categories seeded');

  // 3. Create Sample Products
  const productsData = [
    {
      name: 'Personalized 3D Name Keychain',
      slug: 'personalized-3d-name-keychain',
      shortDescription: 'Custom 3D printed name keychain with dual-color layer accent.',
      fullDescription: 'Carry your identity everywhere. Handcrafted using high-density PLA+ filament with reinforced key ring loops. Includes custom name text printing in bold geometric typeface.',
      categoryId: categories['keychains'].id,
      price: 299,
      compareAtPrice: 399,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      ]),
      colors: JSON.stringify(['Arctic White', 'Matte Black', 'Electric Blue', 'Ruby Red', 'Emerald Green']),
      sizes: JSON.stringify(['Standard (75mm)', 'Large (95mm)']),
      material: 'PLA+ Tough Resin-Infused',
      weight: '18g',
      dimensions: '75 x 22 x 6 mm',
      stockQuantity: 45,
      stockStatus: 'IN_STOCK',
      isFeatured: true,
      isNew: true,
      personalizationEnabled: true,
      customTextEnabled: true,
      tags: JSON.stringify(['Keychain', 'Personalized', 'Bestseller', 'Custom Text']),
    },
    {
      name: 'Low-Poly Dragon Desk Statue',
      slug: 'low-poly-dragon-desk-statue',
      shortDescription: 'Striking geometric low-poly dragon figurine with metallic sheen finish.',
      fullDescription: 'Designed for modern workspace aesthetics. This geometric dragon statue features sharp light-refracting facets printed at 0.12mm precision layer height.',
      categoryId: categories['figures'].id,
      price: 699,
      compareAtPrice: 899,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
      ]),
      colors: JSON.stringify(['Silk Gold', 'Silk Silver', 'Matte Black', 'Obsidian Grey']),
      sizes: JSON.stringify(['Medium (14cm)', 'Large (20cm)']),
      material: 'Silk PLA Metallic',
      weight: '120g',
      dimensions: '140 x 90 x 110 mm',
      stockQuantity: 18,
      stockStatus: 'IN_STOCK',
      isFeatured: true,
      isNew: true,
      personalizationEnabled: false,
      customTextEnabled: false,
      tags: JSON.stringify(['Figure', 'Statue', 'Desk Decor', 'Dragon']),
    },
    {
      name: 'Voronoi Geometric Planter & Pen Cup',
      slug: 'voronoi-geometric-planter-pen-cup',
      shortDescription: 'Parametric open-work Voronoi mesh container for plants or stationery.',
      fullDescription: 'Engineered using generative Voronoi algorithms. Dual inner lining allows water containment for succulents or acts as an eye-catching desk organizer.',
      categoryId: categories['decor'].id,
      price: 549,
      compareAtPrice: 699,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
      ]),
      colors: JSON.stringify(['Matte Black', 'Terracotta Orange', 'Pure White']),
      sizes: JSON.stringify(['Standard (10cm Height)']),
      material: 'Recycled PLA Filament',
      weight: '95g',
      dimensions: '90 x 90 x 100 mm',
      stockQuantity: 22,
      stockStatus: 'IN_STOCK',
      isFeatured: true,
      isNew: false,
      personalizationEnabled: false,
      customTextEnabled: false,
      tags: JSON.stringify(['Decor', 'Planter', 'Voronoi', 'Desk']),
    },
    {
      name: 'Minimalist Modular Cable Organizer Clamps (4-Pack)',
      slug: 'minimalist-modular-cable-organizer-clamps',
      shortDescription: 'Under-desk & side-desk spring-tension cable routers.',
      fullDescription: 'Eliminate cable clutter. Designed with flex-spring TPU/PLA gripping clips that hold USB-C, HDMI, and power cables firmly in place.',
      categoryId: categories['desk-utility'].id,
      price: 349,
      compareAtPrice: 449,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      ]),
      colors: JSON.stringify(['Stealth Black', 'Snow White']),
      sizes: JSON.stringify(['4-Pack']),
      material: 'PETG Industrial Grade',
      weight: '40g',
      dimensions: '45 x 20 x 15 mm each',
      stockQuantity: 30,
      stockStatus: 'IN_STOCK',
      isFeatured: false,
      isNew: true,
      personalizationEnabled: false,
      customTextEnabled: false,
      tags: JSON.stringify(['Utility', 'Cable Management', 'Desk']),
    },
    {
      name: 'Personalized Desk Nameplate Bar',
      slug: 'personalized-desk-nameplate-bar',
      shortDescription: 'Executive desk title bar with custom embossed lettering and base stand.',
      fullDescription: 'Upgrade your office setup with a high-contrast 3D printed desk bar. Custom name and title embossed with sub-millimeter precision.',
      categoryId: categories['personalised'].id,
      price: 799,
      compareAtPrice: 999,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80',
      ]),
      colors: JSON.stringify(['Black Base / Gold Text', 'White Base / Black Text', 'Walnut Wood Fill']),
      sizes: JSON.stringify(['Standard (20cm Length)']),
      material: 'PLA+ & Wood-Infused Filament',
      weight: '140g',
      dimensions: '200 x 40 x 45 mm',
      stockQuantity: 15,
      stockStatus: 'IN_STOCK',
      isFeatured: true,
      isNew: true,
      personalizationEnabled: true,
      customTextEnabled: true,
      tags: JSON.stringify(['Personalized', 'Desk', 'Nameplate', 'Office']),
    },
    {
      name: 'Articulated Fidget Dragon / Slug',
      slug: 'articulated-fidget-dragon-slug',
      shortDescription: 'Flexi-jointed 3D printed fidget toy with smooth tactile click-motion.',
      fullDescription: 'Printed in a single print-in-place pass without glue or assembly. Highly flexible, satisfying fidget movement for stress relief and focus.',
      categoryId: categories['figures'].id,
      price: 399,
      compareAtPrice: 499,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
      ]),
      colors: JSON.stringify(['Rainbow Silk', 'Galaxy Black', 'Neon Green']),
      sizes: JSON.stringify(['Standard (18cm)']),
      material: 'High-Flex PLA',
      weight: '65g',
      dimensions: '180 x 30 x 30 mm',
      stockQuantity: 25,
      stockStatus: 'IN_STOCK',
      isFeatured: false,
      isNew: false,
      personalizationEnabled: false,
      customTextEnabled: false,
      tags: JSON.stringify(['Fidget', 'Flexi', 'Toy', 'Figures']),
    },
  ];

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: prod,
      create: prod,
    });
  }
  console.log('✔ Products seeded');

  // 4. Create Initial Coupons
  const couponsData = [
    {
      code: 'WELCOME10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 299,
      maxDiscount: 200,
      usageLimit: 500,
      isActive: true,
    },
    {
      code: 'SENAZ10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 0,
      maxDiscount: 150,
      usageLimit: 1000,
      isActive: true,
    },
    {
      code: 'FIRSTORDER',
      discountType: 'FIXED',
      discountValue: 100,
      minOrderValue: 499,
      usageLimit: 200,
      isActive: true,
    },
  ];

  for (const c of couponsData) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }
  console.log('✔ Coupons seeded');

  // 5. Create Initial Referrals
  await prisma.referral.upsert({
    where: { referralCode: 'SENAZ-MILAN' },
    update: {},
    create: {
      referralCode: 'SENAZ-MILAN',
      referrerName: 'Milan Jyoti Ray',
      referrerContact: '918761053230',
      totalReferrals: 3,
      totalOrderValue: 2397,
    },
  });
  console.log('✔ Referral record initialized');

  // 6. Create Initial Site Content (Editable Content)
  const defaultHomepageContent = {
    heroTitle: "Made to Print. Built for You.",
    heroSubtitle: "Custom 3D printed products, personalised designs and functional creations made to your exact specifications.",
    primaryCtaText: "Shop Products",
    secondaryCtaText: "Get a Custom Print",
    aboutTitle: "Precision FDM & Resin 3D Printing Service in India",
    aboutSubtitle: "Engineered for durability, surface smoothness, and dimensional accuracy.",
    whyUsPoints: [
      { title: "Sub-Millimeter Precision", text: "Calibrated high-speed FDM printers operating at 0.12mm to 0.20mm layer height." },
      { title: "Premium Engineering Filaments", text: "We print using high-grade PLA+, PETG, TPU flex, and toughness-reinforced resins." },
      { title: "Instant WhatsApp Ordering", text: "No tedious registration. Direct human confirmation & live order updates via WhatsApp." },
      { title: "Custom CAD & File Support", text: "Upload your own .stl, .obj, .3mf files or sketch ideas for rapid custom quotes." }
    ],
    contactWhatsapp: "918761053230",
    contactEmail: "senaz3dprints@gmail.com",
    instagramUrl: "https://instagram.com/senaz3dprints",
    faqItems: [
      { question: "What materials do you use for 3D printing?", answer: "We primarily print with PLA+ (eco-friendly, high stiffness), PETG (heat & water resistant), TPU (flexible rubber-like), and high-resolution Resin for detailed figurines." },
      { question: "How long does custom 3D printing take?", answer: "Most standard catalog products ship within 24-48 hours. Custom CAD designs and complex 3D model requests take 2-4 business days depending on print hours." },
      { question: "Can I send my own 3D model file?", answer: "Yes! Visit our /custom-printing page to upload your .stl, .obj, or .3mf model files along with your preferred material and color." },
      { question: "How does payment work?", answer: "Once you place an order or custom print request on our website, you will be redirected to WhatsApp where we confirm stock, final text previews, and send secure payment options (UPI, GPay, PhonePe, NetBanking)." }
    ]
  };

  await prisma.siteContent.upsert({
    where: { key: 'homepage' },
    update: { content: JSON.stringify(defaultHomepageContent) },
    create: { key: 'homepage', content: JSON.stringify(defaultHomepageContent) },
  });
  console.log('✔ Editable site content initialized');

  console.log('Database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
