import React, { createContext, useContext, useState, ReactNode } from 'react';

// オンボーディングのステップ定義
export type OnboardingStep = 
  | 'OG-STEP-01' // メイン：設定アイコンを案内
  | 'OG-STEP-02' // 管理：部屋管理を案内
  | 'OG-STEP-03' // 部屋管理：追加を案内
  | 'OG-STEP-04' // 部屋登録：部屋名入力と保存
  | 'OG-STEP-05' // 部屋編集：レイアウト編集へ
  | 'OG-STEP-06' // レイアウト：収納追加と保存
  | 'OG-STEP-07' // メイン：アイテム追加へ
  | 'OG-STEP-08' // アイテム登録：保存
  | 'OG-STEP-09' // メイン：検索してタップ
  | 'OG-STEP-10' // 所在確認：自動完了
  | 'completed';

interface OnboardingContextType {
  currentStep: OnboardingStep;
  nextStep: () => void;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // オンボーディングは後回しにするため、初期状態を 'completed' とし、表示を無効化する
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('completed');

  const nextStep = () => {
    setCurrentStep((prev) => {
      switch (prev) {
        case 'OG-STEP-01': return 'OG-STEP-02';
        case 'OG-STEP-02': return 'OG-STEP-03';
        case 'OG-STEP-03': return 'OG-STEP-04';
        case 'OG-STEP-04': return 'OG-STEP-05';
        case 'OG-STEP-05': return 'OG-STEP-06';
        case 'OG-STEP-06': return 'OG-STEP-07';
        case 'OG-STEP-07': return 'OG-STEP-08';
        case 'OG-STEP-08': return 'OG-STEP-09';
        case 'OG-STEP-09': return 'OG-STEP-10';
        case 'OG-STEP-10': return 'completed';
        default: return 'completed';
      }
    });
  };

  const resetOnboarding = () => setCurrentStep('OG-STEP-01');

  return (
    <OnboardingContext.Provider value={{ currentStep, nextStep, resetOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
