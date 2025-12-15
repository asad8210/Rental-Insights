'use client';

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
  Icon as LucideIcon,
} from 'lucide-react';
import { TableIcon, DeskIcon, AlmirahIcon } from '@/components/icons';
import type { FC } from 'react';

const iconMap: Record<string, FC<{ className?: string }> | LucideIcon> = {
  bed: Bed,
  armchair: Armchair,
  table: TableIcon,
  desk: DeskIcon,
  almirah: AlmirahIcon,
  fan: Fan,
  wind: Wind,
  snowflake: Snowflake,
  home: Home,
  building: Building,
  bath: Bath,
  'cooking-pot': CookingPot,
  'brick-wall': BrickWall,
  paintbrush: Paintbrush,
};

interface FeatureIconProps {
  iconName: string;
  className?: string;
}

const FeatureIcon: FC<FeatureIconProps> = ({ iconName, className }) => {
  const IconComponent = iconMap[iconName];

  if (!IconComponent) {
    return null; // Or a default icon
  }

  return <IconComponent className={className} />;
};

export default FeatureIcon;
