# **App Name**: Rental Insights

## Core Features:

- Image Upload and Analysis: Allow users to upload 1-5 images of a room for AI-powered analysis of features.
- Object Detection: Employ AI-based object detection to identify furniture, appliances, and room quality indicators in uploaded images. Only consider objects and features present in the admin-defined JSON price list as valid inputs for pricing calculation. Generative AI tool evaluates object confidences to incorporate furniture detected in uploaded images, or lack thereof, into a description of the unit being appraised.
- Feature Confirmation: Allow the user to confirm or correct key structural features detected automatically, such as whether the room is 1BHK or 2BHK and other such definitional parameters.
- Intelligent Merging: Merge detections from multiple images to eliminate duplication and generate a complete and accurate room profile.
- Weighted Pricing: Apply weighted pricing logic based on the quantity, quality, and combination of detected amenities to classify the room as furnished, semi-furnished, or unfurnished and estimate a fair rental value. Adhere strictly to prices set in the centrally controlled pricing table.
- Rental Prediction Display: Present a predicted rental range to the user with lower and upper price limits based on the characteristics detected in the images.
- Explanation Generation: Generate a human-like explanation detailing which objects and features were detected, how each feature influenced the final price, and why the estimated rent is reasonable.

## Style Guidelines:

- Primary color: Desaturated teal (#99CED3) to inspire trust.
- Background color: Very light, nearly white tint of teal (#F5FCFC).
- Accent color: Analogous blue-green (#66B2B2), a good contrast in brightness to primary, for CTAs and highlights.
- Body and headline font: 'Inter' (sans-serif) for a clean and modern look.
- Use flat, line-based icons to represent different room features and amenities.
- Maintain a clean and organized layout with clear sections for image upload, feature confirmation, and rental prediction.
- Subtle transitions and animations to guide the user through the analysis process.