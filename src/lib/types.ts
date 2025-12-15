import type { FC } from 'react';

export interface BaseFeature {
  id: string;
  name: string;
  basePrice: number;
  icon: string;
}

export interface Furniture extends BaseFeature {}
export interface Appliance extends BaseFeature {}
export interface StructuralFeature extends BaseFeature {}
export interface RoomQuality extends BaseFeature {}

export type Feature = Furniture | Appliance | StructuralFeature | RoomQuality;

export type FeatureCategory = {
  id: 'furniture' | 'appliances' | 'structural' | 'quality';
  name: string;
  items: Feature[];
  type: 'multi'; // Future use: 'single' for radio buttons
};

export type PredictionResult = {
  rentRange: { lower: number; upper: number };
  explanation: string;
  detectedFeatures: Feature[];
  furnishingStatus: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
};

export type ServerActionResponse = {
  data?: PredictionResult;
  error?: string;
};

export type ObjectDetection = {
    label: string;
    confidence: number;
};
