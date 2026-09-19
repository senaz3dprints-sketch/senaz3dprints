'use client';

import React from 'react';
import Lottie3DPrintLoader from './Lottie3DPrintLoader';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
}

export default function LoadingSpinner({
  label = 'Loading 3D Models & Specs...',
  size = 'md',
}: LoadingSpinnerProps) {
  return <Lottie3DPrintLoader label={label} size={size} />;
}
