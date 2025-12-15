import {
  Bed,
  Armchair,
  Fan,
  Snowflake,
  Wind,
  CookingPot,
  Bath,
  Building,
  Home,
  Paintbrush,
  BrickWall,
} from 'lucide-react';
import { TableIcon, DeskIcon, AlmirahIcon } from '@/components/icons';
import type { FeatureCategory } from './types';

export const PRICING_DATA: FeatureCategory[] = [
  {
    id: 'furniture',
    name: 'Furniture',
    type: 'multi',
    items: [
      { id: 'bed', name: 'Bed', basePrice: 800, icon: Bed },
      { id: 'chair', name: 'Chair', basePrice: 200, icon: Armchair },
      { id: 'table', name: 'Table', basePrice: 300, icon: TableIcon },
      { id: 'desk', name: 'Desk', basePrice: 400, icon: DeskIcon },
      { id: 'almirah', name: 'Almirah', basePrice: 500, icon: AlmirahIcon },
    ],
  },
  {
    id: 'appliances',
    name: 'Appliances',
    type: 'multi',
    items: [
      { id: 'fan', name: 'Fan', basePrice: 150, icon: Fan },
      { id: 'cooler', name: 'Cooler', basePrice: 400, icon: Wind },
      { id: 'ac', name: 'Air Conditioner', basePrice: 1500, icon: Snowflake },
    ],
  },
  {
    id: 'structural',
    name: 'Structural Features',
    type: 'multi',
    items: [
      { id: '1bhk', name: '1BHK', basePrice: 1000, icon: Home },
      { id: '2bhk', name: '2BHK', basePrice: 2000, icon: Home },
      { id: 'balcony', name: 'Balcony', basePrice: 500, icon: Building },
      { id: 'attached-bathroom', name: 'Attached Bathroom', basePrice: 700, icon: Bath },
      { id: 'small-kitchen', name: 'Small Kitchen', basePrice: 400, icon: CookingPot },
      { id: 'medium-kitchen', name: 'Medium Kitchen', basePrice: 800, icon: CookingPot },
    ],
  },
  {
    id: 'quality',
    name: 'Room Quality',
    type: 'multi',
    items: [
      { id: 'furnished-floor', name: 'Furnished Floor', basePrice: 300, icon: BrickWall },
      { id: 'good-walls', name: 'Good Wall Condition', basePrice: 200, icon: Paintbrush },
    ],
  },
];

export const ALL_FEATURES = PRICING_DATA.flatMap(category => category.items);

export const ALL_FEATURES_MAP = new Map(ALL_FEATURES.map(feature => [feature.id, feature]));

export const DETECTABLE_FEATURES = PRICING_DATA
  .filter(category => category.id !== 'structural')
  .flatMap(category => category.items);
