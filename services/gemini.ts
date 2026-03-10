
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisBlueprint, BusinessContext } from "../types";
import { STRATEGIC_CORE } from "./strategicCore";

const API_KEY = process.env.API_KEY || "";

export interface ValidationResult {
  isValid: boolean;
  score: number;
  feedback: string[];
  correctedBlueprint?: AnalysisBlueprint;
}

export const validateBlueprint = async (blueprint: AnalysisBlueprint): Promise<ValidationResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    TASK: Validate the following Business Analysis Blueprint against foundational strategic rules and industry standards.
    
    FOUNDATIONAL STRATEGIC CORE:
    - FRAMEWORKS: ${STRATEGIC_CORE.copywritingFrameworks}
    - FUNNELS: ${STRATEGIC_CORE.funnelLogics}
    - PSYCHOLOGY: ${STRATEGIC_CORE.personaPsychology}
    
    BLUEPRINT TO VALIDATE:
    ${JSON.stringify(blueprint, null, 2)}
    
    INSTRUCTIONS:
    1. Check if the blueprint logically incorporates the foundational strategic core.
    2. Verify that the steps are logically sequenced and unambiguous.
    3. Ensure industry standards for business analysis are met.
    4. Score the blueprint from 0 to 100 based on quality and adherence to rules.
    5. If the score is below 80, provide a corrected version of the blueprint.
    6. Provide specific feedback on what is good and what needs improvement.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isValid: { type: Type.BOOLEAN, description: "True if score is 80 or above" },
          score: { type: Type.NUMBER, description: "Score from 0 to 100" },
          feedback: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific feedback points" },
          correctedBlueprint: {
            type: Type.OBJECT,
            description: "Provide a corrected blueprint if isValid is false",
            properties: {
              metadata: {
                type: Type.OBJECT,
                properties: {
                  analysisName: { type: Type.STRING },
                  strategyVersion: { type: Type.STRING },
                  applicableIndustries: { type: Type.ARRAY, items: { type: Type.STRING } },
                  applicableRegions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  requiredBusinessInputs: { type: Type.ARRAY, items: { type: Type.STRING } },
                  requiredExternalDataTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
                  analysisComplexityLevel: { type: Type.STRING },
                  estimatedAnalysisDepth: { type: Type.STRING },
                  dependencies: { type: Type.ARRAY, items: { type: Type.STRING } },
                  constraints: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepId: { type: Type.STRING },
                    stepName: { type: Type.STRING },
                    purpose: { type: Type.STRING },
                    requiredInputs: { type: Type.ARRAY, items: { type: Type.STRING } },
                    dataSources: { type: Type.ARRAY, items: { type: Type.STRING } },
                    processingLogic: { type: Type.STRING },
                    expectedIntermediateOutput: { type: Type.STRING },
                    validationRules: { type: Type.ARRAY, items: { type: Type.STRING } },
                    conditionsToProceed: { type: Type.STRING },
                  },
                }
              }
            }
          }
        },
        required: ["isValid", "score", "feedback"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as ValidationResult;
  } catch (error) {
    console.error("Failed to parse validation JSON", error);
    throw new Error("Invalid validation format returned from API.");
  }
};

export const generateBlueprint = async (context: BusinessContext): Promise<AnalysisBlueprint> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    TASK: Generate a high-precision Business Analysis Blueprint.
    
    FOUNDATIONAL STRATEGIC CORE (BLEND THESE PRINCIPLES):
    - FRAMEWORKS: ${STRATEGIC_CORE.copywritingFrameworks}
    - FUNNELS: ${STRATEGIC_CORE.funnelLogics}
    - PSYCHOLOGY: ${STRATEGIC_CORE.personaPsychology}
    
    SPECIFIC BUSINESS PARAMETERS:
    - Business Name: ${context.name}
    - Industry: ${context.industry}
    - Location: ${context.location}
    - Specific Situation/Challenge: ${context.situation}
    
    INSTRUCTIONS:
    1. Blending: Synthesize the foundational principles (Value Ladder, Winner's Process, Meta Ads Funnels, etc.) into a cohesive analysis structure tailored to the ${context.industry} industry and the specific challenge of "${context.situation}".
    2. Blueprint Only: DO NOT analyze the business. DO NOT generate insights.
    3. Output Structure: Define the machine-readable steps another AI would need to follow to perform a full strategic analysis.
    4. Focus: High attention to persona awareness levels, sophistication, and offer structure (Value Ladder).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          metadata: {
            type: Type.OBJECT,
            properties: {
              analysisName: { type: Type.STRING },
              strategyVersion: { type: Type.STRING },
              applicableIndustries: { type: Type.ARRAY, items: { type: Type.STRING } },
              applicableRegions: { type: Type.ARRAY, items: { type: Type.STRING } },
              requiredBusinessInputs: { type: Type.ARRAY, items: { type: Type.STRING } },
              requiredExternalDataTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
              analysisComplexityLevel: { type: Type.STRING },
              estimatedAnalysisDepth: { type: Type.STRING },
              dependencies: { type: Type.ARRAY, items: { type: Type.STRING } },
              constraints: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["analysisName", "strategyVersion", "applicableIndustries", "requiredBusinessInputs"]
          },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stepId: { type: Type.STRING },
                stepName: { type: Type.STRING },
                purpose: { type: Type.STRING },
                requiredInputs: { type: Type.ARRAY, items: { type: Type.STRING } },
                dataSources: { type: Type.ARRAY, items: { type: Type.STRING } },
                processingLogic: { type: Type.STRING },
                expectedIntermediateOutput: { type: Type.STRING },
                validationRules: { type: Type.ARRAY, items: { type: Type.STRING } },
                conditionsToProceed: { type: Type.STRING },
              },
              required: ["stepId", "stepName", "processingLogic"]
            }
          }
        },
        required: ["metadata", "steps"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}") as AnalysisBlueprint;
  } catch (error) {
    console.error("Failed to parse blueprint JSON", error);
    throw new Error("Invalid blueprint format returned from API.");
  }
};

export const createChatSession = (systemInstruction: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction,
    },
  });
};
