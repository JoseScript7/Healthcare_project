export const generateSampleData = () => {
  const categories = [
    'Analgesics', 'Antibiotics', 'Antivirals', 'Cardiovascular',
    'Dermatological', 'Diabetes', 'Gastrointestinal', 'Hormones',
    'Immunological', 'Neurological', 'Ophthalmological', 'Psychiatric',
    'Respiratory', 'Vaccines'
  ];

  const manufacturers = [
    'Pfizer', 'Novartis', 'Roche', 'Merck', 'GSK', 'Johnson & Johnson',
    'AstraZeneca', 'Sanofi', 'Abbott', 'Bayer', 'Eli Lilly', 'Bristol Myers Squibb'
  ];

  const locations = Array.from({ length: 10 }, (_, i) => 
    `Storage ${String.fromCharCode(65 + i)}-${String(Math.floor(Math.random() * 20) + 1).padStart(2, '0')}`
  );

  const medicines = [
    'Aspirin', 'Ibuprofen', 'Paracetamol', 'Amoxicillin', 'Azithromycin',
    'Ciprofloxacin', 'Metformin', 'Omeprazole', 'Lisinopril', 'Metoprolol',
    'Amlodipine', 'Simvastatin', 'Sertraline', 'Fluoxetine', 'Gabapentin',
    'Tramadol', 'Hydrocodone', 'Prednisone', 'Levothyroxine', 'Albuterol'
  ];

  const generateExpiryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 365));
    return date.toISOString().split('T')[0];
  };

  return Array.from({ length: 80 }, (_, index) => {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const currentStock = Math.floor(Math.random() * 1000) + 100;
    const reorderPoint = Math.floor(Math.random() * 200) + 50;
    const expiryDate = generateExpiryDate();
    const daysUntilExpiry = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

    return {
      id: index + 1,
      name: `${medicines[Math.floor(Math.random() * medicines.length)]} ${Math.floor(Math.random() * 500)}mg`,
      category,
      currentStock,
      unit: Math.random() > 0.5 ? 'tablets' : 'bottles',
      manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
      expiryDate,
      location: locations[Math.floor(Math.random() * locations.length)],
      serialNumber: `SN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      reorderPoint,
      daysUntilExpiry,
      status: currentStock < reorderPoint ? 'Low Stock' : 'In Stock'
    };
  });
}; 