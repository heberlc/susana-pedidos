import type { Product, ProductCategory } from '../types';

const categorize = (name: string): ProductCategory => {
  const upper = name.toUpperCase();
  if (upper.includes('AGUA') || upper.includes('CIELO')) return 'agua';
  if (upper.includes('COLA') || upper.includes('KR') || upper.includes('BIG') || upper.includes('ORO') || upper.includes('CIFRUT')) return 'gaseosa';
  if (upper.includes('VOLT') || upper.includes('SPORADE')) return 'energizante';
  if (upper.includes('PULP') || upper.includes('NARANJA') || upper.includes('LIMON') || upper.includes('MANZANA') || upper.includes('MARACUYA')) return 'jugo';
  if (upper.includes('BIO')) return 'deporte';
  return 'otro';
};

const rawProducts = [
  { supplier: 'AJEPER S.A', code: '608469', name: 'AGUA CIELO SIN GAS 1000 ml PET 6 pack', units: 6, unitPrice: 1.67, packPrice: 10.00 },
  { supplier: 'AJEPER S.A', code: '608462', name: 'AGUA CIELO SIN GAS 625 ml PET 15 pack', units: 15, unitPrice: 0.80, packPrice: 12.00 },
  { supplier: 'AJEPER S.A', code: '699664', name: 'BIG COLA PET NO RETORNABLE 400 ML 15 MC', units: 15, unitPrice: 0.80, packPrice: 12.00 },
  { supplier: 'AJEPER S.A', code: '622089', name: 'BIO ALOE 520 ML PET 12 PACK', units: 12, unitPrice: 2.61, packPrice: 31.28 },
  { supplier: 'AJEPER S.A', code: '624285', name: 'CIELO AGUA NARANJA PET NO RETORNABLE 600 ML 12', units: 12, unitPrice: 1.17, packPrice: 14.00 },
  { supplier: 'AJEPER S.A', code: '623835', name: 'CIELO LIMON PET NO RETORNABLE 600 ML 12 MC', units: 12, unitPrice: 1.17, packPrice: 14.00 },
  { supplier: 'AJEPER S.A', code: '623836', name: 'CIELO MANZANA PET NO RETORNABLE 600 ML 12 MC', units: 12, unitPrice: 1.17, packPrice: 14.00 },
  { supplier: 'AJEPER S.A', code: '623840', name: 'CIELO MARACUYA PET NO RETORNABLE 600 ML 12 MC', units: 12, unitPrice: 1.17, packPrice: 14.00 },
  { supplier: 'AJEPER S.A', code: '622377', name: 'CIFRUT CITRUS 350 ml PET 15 pack', units: 15, unitPrice: 0.80, packPrice: 12.00 },
  { supplier: 'AJEPER S.A', code: '622376', name: 'CIFRUT FRUIT 350 ml PET 15 pack', units: 15, unitPrice: 0.80, packPrice: 12.00 },
  { supplier: 'AJEPER S.A', code: '621788', name: 'CIFRUT ISLAND 350 ml PET 15 pack', units: 15, unitPrice: 0.80, packPrice: 12.00 },
  { supplier: 'AJEPER S.A', code: '624050', name: 'KR COLA PET NO RETORNABLE 400 ML 15 MC', units: 15, unitPrice: 0.79, packPrice: 11.80 },
  { supplier: 'AJEPER S.A', code: '699311', name: 'KR FRESA PET NO RETORNABLE 400 ML 15 MC', units: 15, unitPrice: 0.79, packPrice: 11.80 },
  { supplier: 'AJEPER S.A', code: '699404', name: 'KR GUARANA PET NO RETORNABLE 400 ML 15 MC', units: 15, unitPrice: 0.79, packPrice: 11.80 },
  { supplier: 'AJEPER S.A', code: '622386', name: 'KR ISLAND PUNCH PET NO RETONABLE 350 ML 15 CM', units: 15, unitPrice: 0.79, packPrice: 11.80 },
  { supplier: 'AJEPER S.A', code: '624046', name: 'KR KOLITA PET NO RETORNABLE 400 ML 15 MC', units: 15, unitPrice: 0.79, packPrice: 11.80 },
  { supplier: 'AJEPER S.A', code: '699303', name: 'KR LIMA LIMON PET NO RETORNABLE 400 ML 15 MC', units: 15, unitPrice: 0.79, packPrice: 11.80 },
  { supplier: 'AJEPER S.A', code: '699289', name: 'KR NARANJA PET NO RETORNABLE 400 ML 15 MC', units: 15, unitPrice: 0.79, packPrice: 11.80 },
  { supplier: 'AJEPER S.A', code: '699302', name: 'KR PIÑA PET NO RETORNABLE 400 ML 15 MC', units: 15, unitPrice: 0.79, packPrice: 11.80 },
  { supplier: 'AJEPER S.A', code: '699411', name: 'ORO ORO PET NO RETORNABLE 400 ML 15 MC', units: 15, unitPrice: 0.80, packPrice: 12.00 },
  { supplier: 'AJEPER S.A', code: '699360', name: 'PULP DURAZNO TETRA PAK 315 ML 24 MC', units: 24, unitPrice: 1.30, packPrice: 31.25 },
  { supplier: 'AJEPER S.A', code: '699378', name: 'SPORADE BLUEBERRY 500 ml PET 12 pack', units: 12, unitPrice: 1.59, packPrice: 20.00 },
  { supplier: 'AJEPER S.A', code: '699370', name: 'SPORADE MANDARINA 500 ml PET 12 pack', units: 12, unitPrice: 1.59, packPrice: 20.00 },
  { supplier: 'AJEPER S.A', code: '699371', name: 'SPORADE TROPICAL 500 ml PET 12 pack', units: 12, unitPrice: 1.59, packPrice: 20.00 },
  { supplier: 'AJEPER S.A', code: '622783', name: 'VOLT GAMER PONCHE FRUTAS 300 ML', units: 12, unitPrice: 1.59, packPrice: 20.00 },
  { supplier: 'AJEPER S.A', code: '699538', name: 'VOLT GINSENG 300 ml PET (FANTASY)', units: 12, unitPrice: 1.59, packPrice: 20.00 },
  { supplier: 'AJEPER S.A', code: '699546', name: 'VOLT MACA 300 ml PET (FRAMBRUESA)', units: 12, unitPrice: 1.59, packPrice: 20.00 },
  { supplier: 'AJEPER S.A', code: '699547', name: 'VOLT PINK 300 ml PET', units: 12, unitPrice: 1.59, packPrice: 20.00 },
];

export const PRODUCTS: Product[] = rawProducts.map((p) => ({
  id: `${p.supplier}-${p.code}`,
  supplier: p.supplier,
  supplierCode: p.code,
  name: p.name,
  unitsPerBox: p.units,
  unitPrice: p.unitPrice,
  packPrice: p.packPrice,
  category: categorize(p.name),
}));

export const CATEGORIES: ProductCategory[] = ['agua', 'gaseosa', 'energizante', 'jugo', 'deporte', 'otro'];
