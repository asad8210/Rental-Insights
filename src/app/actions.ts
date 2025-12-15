'use server';

import { mergeDetections } from '@/ai/flows/merge-detections-from-multiple-images';
import { explainRentalPrediction } from '@/ai/flows/explain-rental-prediction';
import { DETECTABLE_FEATURES, ALL_FEATURES_MAP, PRICING_DATA } from '@/lib/pricing-database';
import type { PredictionResult, ServerActionResponse, ObjectDetection, Feature } from '@/lib/types';


// Mock function to simulate object detection on a single image
const mockDetectObjectsInImage = async (imageUri: string): Promise<ObjectDetection[]> => {
    // In a real scenario, this would call a vision model.
    // Here, we simulate it by randomly picking some features.
    const detected: ObjectDetection[] = [];
    const featureCount = Math.floor(Math.random() * 4) + 2; // Detect 2-5 features

    for (let i = 0; i < featureCount; i++) {
        const randomFeature = DETECTABLE_FEATURES[Math.floor(Math.random() * DETECTABLE_FEATURES.length)];
        if (!detected.some(d => d.label === randomFeature.id)) {
            detected.push({
                label: randomFeature.id,
                confidence: Math.random() * (0.98 - 0.7) + 0.7, // Confidence between 70% and 98%
            });
        }
    }
    //This is just to make it seem like it's taking time
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200));

    return detected;
};

const calculateRent = (featureIds: string[]): {
    rentRange: { lower: number; upper: number };
    furnishingStatus: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
    pricingDetails: Record<string, number>;
} => {
    let baseRent = 500; // Base for an empty room
    const pricingDetails: Record<string, number> = {};

    featureIds.forEach(id => {
        const feature = ALL_FEATURES_MAP.get(id);
        if (feature) {
            baseRent += feature.basePrice;
            pricingDetails[feature.name] = feature.basePrice;
        }
    });
    
    const furnitureItems = featureIds.filter(id => 
        PRICING_DATA.find(c => c.id === 'furniture')?.items.some(i => i.id === id)
    ).length;

    let furnishingStatus: 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
    let multiplier = 1.0;

    if (furnitureItems > 3) {
        furnishingStatus = 'Furnished';
        multiplier = 1.5;
    } else if (furnitureItems > 0) {
        furnishingStatus = 'Semi-Furnished';
        multiplier = 1.2;
    } else {
        furnishingStatus = 'Unfurnished';
    }

    const finalRent = baseRent * multiplier;
    
    // Create a range, e.g., +/- 100-200
    const rangeOffset = Math.max(100, finalRent * 0.05);

    return {
        rentRange: {
            lower: Math.round((finalRent - rangeOffset) / 50) * 50,
            upper: Math.round((finalRent + rangeOffset) / 50) * 50,
        },
        furnishingStatus,
        pricingDetails,
    };
};


export const getRentalPrediction = async (imageUris: string[], structuralFeatureIds: string[]): Promise<ServerActionResponse> => {
    try {
        // Step 1: "Detect" objects in all images concurrently
        const detectionPromises = imageUris.map(uri => mockDetectObjectsInImage(uri));
        const allDetections = await Promise.all(detectionPromises);

        // Step 2: Merge detections using Genkit flow
        const mergeResult = await mergeDetections({ imageDetections: allDetections });
        const detectedFeatureIds = mergeResult.mergedDetections.map(d => d.label);
        
        // Step 3: Combine AI-detected features with user-confirmed structural features
        const finalFeatureIds = Array.from(new Set([...detectedFeatureIds, ...structuralFeatureIds]));

        const detectedFeatures: Feature[] = finalFeatureIds
            .map(id => ALL_FEATURES_MAP.get(id))
            .filter((f): f is Feature => f !== undefined);

        // Step 4: Calculate rent based on the final feature list
        const { rentRange, furnishingStatus, pricingDetails } = calculateRent(finalFeatureIds);
        
        // Step 5: Generate a human-like explanation using Genkit flow
        const explanationResult = await explainRentalPrediction({
            detectedFeatures: detectedFeatures.map(f => f.name),
            estimatedRentRange: rentRange,
            pricingDetails: pricingDetails,
        });

        const result: PredictionResult = {
            rentRange,
            explanation: explanationResult.explanation,
            detectedFeatures,
            furnishingStatus,
        };
        
        return { data: result };

    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during analysis.';
        return { error: `AI analysis failed. Details: ${errorMessage}` };
    }
};
