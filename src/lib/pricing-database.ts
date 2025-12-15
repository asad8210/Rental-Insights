import type { FeatureCategory } from './types';

export const PRICING_DATA: FeatureCategory[] = [
  {
    id: 'furniture',
    name: 'Furniture',
    type: 'multi',
    items: [
      { id: 'bed', name: 'Bed', basePrice: 800, icon: 'bed' },
      { id: 'chair', name: 'Chair', basePrice: 200, icon: 'armchair' },
      { id: 'table', name: 'Table', basePrice: 300, icon: 'table' },
      { id: 'desk', name: 'Desk', basePrice: 400, icon: 'desk' },
      { id: 'almirah', name: 'Almirah', basePrice: 500, icon: 'almirah' },
    ],
  },
  {
    id: 'appliances',
    name: 'Appliances',
    type: 'multi',
    items: [
      { id: 'fan', name: 'Fan', basePrice: 150, icon: 'fan' },
      { id: 'cooler', name: 'Cooler', basePrice: 400, icon: 'wind' },
      { id: 'ac', name: 'Air Conditioner', basePrice: 1500, icon: 'snowflake' },
    ],
  },
  {
    id: 'structural',
    name: 'Structural Features',
    type: 'multi',
    items: [
      { id: '1bhk', name: '1BHK', basePrice: 1000, icon: 'home' },
      { id: '2bhk', name: '2BHK', basePrice: 2000, icon: 'home' },
      { id: 'balcony', name: 'Balcony', basePrice: 500, icon: 'building' },
      { id: 'attached-bathroom', name: 'Attached Bathroom', basePrice: 700, icon: 'bath' },
      { id: 'small-kitchen', name: 'Small Kitchen', basePrice: 400, icon: 'cooking-pot' },
      { id: 'medium-kitchen', name: 'Medium Kitchen', basePrice: 800, icon: 'cooking-pot' },
    ],
  },
  {
    id: 'quality',
    name: 'Room Quality',
    type: 'multi',
    items: [
      { id: 'furnished-floor', name: 'Furnished Floor', basePrice: 300, icon: 'brick-wall' },
      { id: 'good-walls', name: 'Good Wall Condition', basePrice: 200, icon: 'paintbrush' },
    ],
  },
];

export const ALL_FEATURES = PRICING_DATA.flatMap(category => category.items);

export const ALL_FEATURES_MAP = new Map(ALL_FEATURES.map(feature => [feature.id, feature]));

export const DETECTABLE_FEATURES = PRICING_DATA
  .filter(category => category.id !== 'structural')
  .flatMap(category => category.items);
