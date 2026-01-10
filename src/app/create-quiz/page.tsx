'use client';

import { useState } from 'react';
import UnifiedAIQuizGenerator from '@/components/public/UnifiedAIQuizGenerator';
import QuizCreationModeSelector from '@/components/public/QuizCreationModeSelector';

export default function CreateQuizPage() {
  const [selectedMode, setSelectedMode] = useState<'simple' | 'advanced' | null>(null);

  const handleModeSelect = (mode: 'simple' | 'advanced') => {
    setSelectedMode(mode);
  };

  const handleBackToModeSelection = () => {
    setSelectedMode(null);
  };

  if (!selectedMode) {
    return <QuizCreationModeSelector onModeSelect={handleModeSelect} />;
  }

  if (selectedMode === 'simple') {
    return (
      <UnifiedAIQuizGenerator 
        type="text" 
        onBackToModeSelection={handleBackToModeSelection} 
      />
    );
  }

  if (selectedMode === 'advanced') {
    return (
      <UnifiedAIQuizGenerator 
        type="file" 
        onBackToModeSelection={handleBackToModeSelection} 
      />
    );
  }

  return null;
}