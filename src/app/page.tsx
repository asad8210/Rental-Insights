'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import {
  UploadCloud,
  FileImage,
  X,
  LoaderCircle,
  Wand2,
  ArrowRight,
  CheckCircle2,
  Info,
  RefreshCw,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import type { PredictionResult, StructuralFeature } from '@/lib/types';
import { getRentalPrediction } from '@/app/actions';
import { PRICING_DATA } from '@/lib/pricing-database';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import AppHeader from '@/components/layout/header';
import AppFooter from '@/components/layout/footer';
import placeholderImageData from '@/lib/placeholder-images.json';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

type Step = 'upload' | 'confirm' | 'analyzing' | 'results';

export default function RentalInsightsPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [structuralFeatures, setStructuralFeatures] = useState<string[]>([]);
  const [step, setStep] = useState<Step>('upload');
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const heroImage = placeholderImageData.placeholderImages.find(p => p.id === 'hero');

  const structuralOptions = PRICING_DATA.find(
    (cat) => cat.id === 'structural'
  )!.items as StructuralFeature[];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    setError(null);
    const validFiles = newFiles.filter((file) => {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed.');
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`File size should not exceed ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
        return false;
      }
      return true;
    });

    if (error) return;

    const combinedFiles = [...files, ...validFiles].slice(0, MAX_FILES);
    setFiles(combinedFiles);
    generatePreviews(combinedFiles);
  };

  const generatePreviews = (filesToPreview: File[]) => {
    const previewPromises = filesToPreview.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previewPromises)
      .then((previews) => setImagePreviews(previews))
      .catch(() => setError('Could not generate image previews.'));
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setImagePreviews(newPreviews);
  };
  
  const handleStructuralFeatureChange = (featureId: string, checked: boolean) => {
    setStructuralFeatures(prev => 
      checked ? [...prev, featureId] : prev.filter(id => id !== featureId)
    );
  };

  const handleSubmit = () => {
    if (imagePreviews.length === 0) {
      setError('Please upload at least one image.');
      return;
    }
    setStep('analyzing');
    setError(null);

    startTransition(async () => {
      const result = await getRentalPrediction(imagePreviews, structuralFeatures);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: result.error,
        });
        setStep('confirm');
      } else {
        setResult(result.data);
        setStep('results');
      }
    });
  };
  
  const handleStartOver = () => {
    setFiles([]);
    setImagePreviews([]);
    setStructuralFeatures([]);
    setResult(null);
    setError(null);
    setStep('upload');
  }

  const renderUploadStep = () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Upload Room Images</CardTitle>
        <CardDescription>Upload 1 to {MAX_FILES} images of the room. Clear photos from different angles work best.</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <UploadCloud className="w-12 h-12 text-muted-foreground" />
          <p className="mt-4 text-center text-muted-foreground">
            <span className="font-semibold text-accent">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP (max {MAX_FILE_SIZE / 1024 / 1024}MB each)</p>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={files.length >= MAX_FILES}
          />
        </div>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        {imagePreviews.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold">Selected Images:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-2">
              {imagePreviews.map((src, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={src}
                    alt={`Preview ${index + 1}`}
                    width={100}
                    height={100}
                    className="object-cover w-full h-24 rounded-md"
                  />
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-background/50 text-foreground rounded-full p-0.5 group-hover:bg-destructive group-hover:text-destructive-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={() => setStep('confirm')} disabled={imagePreviews.length === 0} className="w-full sm:w-auto ml-auto">
          Next <ArrowRight className="ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );

  const renderConfirmStep = () => (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Confirm Details</CardTitle>
        <CardDescription>Verify the images and provide additional details about the property.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2">Uploaded Images</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {imagePreviews.map((src, index) => (
              <Image
                key={index}
                src={src}
                alt={`Preview ${index + 1}`}
                width={100}
                height={100}
                className="object-cover w-full h-24 rounded-md"
              />
            ))}
          </div>
        </div>
        <Separator />
        <div>
          <h3 className="font-semibold mb-3">Structural Features</h3>
          <div className="grid grid-cols-2 gap-4">
            {structuralOptions.map((feature) => (
              <div key={feature.id} className="flex items-center space-x-2">
                <Checkbox
                  id={feature.id}
                  checked={structuralFeatures.includes(feature.id)}
                  onCheckedChange={(checked) => handleStructuralFeatureChange(feature.id, checked as boolean)}
                />
                <Label htmlFor={feature.id} className="flex items-center gap-2 cursor-pointer">
                  <feature.icon className="w-5 h-5 text-muted-foreground" />
                  {feature.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline" onClick={() => setStep('upload')}>Back</Button>
        <Button onClick={handleSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Wand2 className="mr-2" /> Get Estimate
        </Button>
      </CardFooter>
    </Card>
  );

  const renderAnalyzingStep = () => (
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center justify-center gap-2">
          <LoaderCircle className="w-8 h-8 animate-spin text-accent" />
          Analyzing...
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Our AI is examining your images to identify features and calculate the perfect rental price. This might take a moment.</p>
        <Progress value={50} className="w-full mt-6" />
      </CardContent>
    </Card>
  );
  
  const renderResultsStep = () => result && (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-3xl font-headline text-center text-accent">
          Estimated Monthly Rent
        </CardTitle>
        <CardDescription className="text-center text-5xl font-bold text-foreground py-4">
          ₹{result.rentRange.lower.toLocaleString()} - ₹{result.rentRange.upper.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" /> Detected & Confirmed Features
          </h3>
          <div className="flex flex-wrap gap-3">
            {result.detectedFeatures.map(feature => (
              <div key={feature.id} className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">
                <feature.icon className="w-4 h-4 text-muted-foreground" />
                <span>{feature.name}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">Room classified as: <span className="font-semibold text-foreground">{result.furnishingStatus}</span></p>
        </div>
        <Separator />
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle className="font-semibold flex items-center gap-2">
            AI-Powered Explanation
          </AlertTitle>
          <AlertDescription className="mt-2 leading-relaxed text-foreground/80">
            {result.explanation}
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Button onClick={handleStartOver} className="w-full sm:w-auto mx-auto" variant="secondary">
          <RefreshCw className="mr-2" /> Start New Analysis
        </Button>
      </CardFooter>
    </Card>
  );

  const renderStep = () => {
    switch (step) {
      case 'upload':
        return renderUploadStep();
      case 'confirm':
        return renderConfirmStep();
      case 'analyzing':
        return renderAnalyzingStep();
      case 'results':
        return renderResultsStep();
      default:
        return renderUploadStep();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <AppHeader />
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        {step === 'upload' && !heroImage && (
          <div className="text-center mb-8 max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold font-headline">AI-Powered Rental Insights</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Get an instant, data-driven rent estimate for any room. Just upload photos and let our AI do the rest.
            </p>
          </div>
        )}
        {step === 'upload' && heroImage && (
          <div className="relative w-full max-w-5xl h-64 rounded-xl overflow-hidden mb-8">
            <Image 
              src={heroImage.imageUrl} 
              alt={heroImage.description}
              data-ai-hint={heroImage.imageHint}
              fill 
              className="object-cover" 
              priority
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-4">
              <h1 className="text-4xl md:text-5xl font-bold font-headline text-white">AI-Powered Rental Insights</h1>
              <p className="mt-4 text-lg text-white/80 max-w-2xl">
                Get an instant, data-driven rent estimate for any room. Just upload photos and let our AI do the rest.
              </p>
            </div>
          </div>
        )}
        {renderStep()}
      </main>
      <AppFooter />
    </div>
  );
}
