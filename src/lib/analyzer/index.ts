import { analyzeJavaScript, AnalysisResult } from './javascript';
import { analyzePython } from './python';

export interface ComprehensiveAnalysis extends AnalysisResult {
    language: string;
    timestamp: string;
    overallScore: number; // 0-100, where 100 is "Clean" and 0 is "Chaotic"
}

export function analyzeCode(code: string, language: string): ComprehensiveAnalysis {
    let result: AnalysisResult;

    if (language === 'python') {
        result = analyzePython(code);
    } else {
        // Default to JS/TS
        result = analyzeJavaScript(code);
    }

    // Calculate a simplified overall score
    // CC: ideal < 5
    // Depth: ideal < 3
    // Length: ideal < 50
    const ccScore = Math.max(0, 100 - (result.cyclomaticComplexity - 1) * 10);
    const depthScore = Math.max(0, 100 - result.nestedDepth * 15);
    const lengthScore = Math.max(0, 100 - (result.functionLength / 100) * 50);
    const unusedScore = Math.max(0, 100 - result.unusedVariables.length * 20);

    const overallScore = Math.round((ccScore + depthScore + lengthScore + unusedScore) / 4);

    return {
        ...result,
        language,
        timestamp: new Date().toISOString(),
        overallScore
    };
}
