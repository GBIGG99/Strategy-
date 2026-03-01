
export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CONTEXT_SETUP = 'CONTEXT_SETUP',
  BLUEPRINT_VIEW = 'BLUEPRINT_VIEW',
  CHAT = 'CHAT',
  LIVE_VOICE = 'LIVE_VOICE'
}

export interface BusinessContext {
  name: string;
  industry: string;
  location: string;
  situation: string;
}

export interface AnalysisMetadata {
  analysisName: string;
  strategyVersion: string;
  applicableIndustries: string[];
  applicableRegions: string[];
  requiredBusinessInputs: string[];
  requiredExternalDataTypes: string[];
  analysisComplexityLevel: 'Standard' | 'High' | 'Advanced' | 'Enterprise';
  estimatedAnalysisDepth: string;
  dependencies: string[];
  constraints: string[];
}

export interface BlueprintStep {
  stepId: string;
  stepName: string;
  purpose: string;
  requiredInputs: string[];
  dataSources: string[];
  processingLogic: string;
  expectedIntermediateOutput: string;
  validationRules: string[];
  conditionsToProceed: string;
}

export interface AnalysisBlueprint {
  metadata: AnalysisMetadata;
  steps: BlueprintStep[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
