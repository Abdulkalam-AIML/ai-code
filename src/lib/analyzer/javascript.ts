import { parse } from 'acorn';
import * as walk from 'acorn-walk';

export interface AnalysisResult {
  cyclomaticComplexity: number;
  functionLength: number;
  nestedDepth: number;
  unusedVariables: string[];
  suggestions: string[];
}

export function analyzeJavaScript(code: string): AnalysisResult {
  let cyclomaticComplexity = 1; // Base complexity
  let maxDepth = 0;
  let functionLines = 0;
  const variables = new Set<string>();
  const usedVariables = new Set<string>();
  const suggestions: string[] = [];

  try {
    const ast = parse(code, { ecmaVersion: 'latest', sourceType: 'module' });

    walk.recursive(ast, { depth: 0 }, {
      FunctionDeclaration(node: any, state: any, c: any) {
        functionLines += (node.loc?.end.line || 0) - (node.loc?.start.line || 0);
        c(node.body, { depth: state.depth + 1 });
      },
      IfStatement(node: any, state: any, c: any) {
        cyclomaticComplexity++;
        maxDepth = Math.max(maxDepth, state.depth + 1);
        c(node.consequent, { depth: state.depth + 1 });
        if (node.alternate) c(node.alternate, { depth: state.depth + 1 });
      },
      WhileStatement(node: any, state: any, c: any) {
        cyclomaticComplexity++;
        maxDepth = Math.max(maxDepth, state.depth + 1);
        c(node.body, { depth: state.depth + 1 });
      },
      ForStatement(node: any, state: any, c: any) {
        cyclomaticComplexity++;
        maxDepth = Math.max(maxDepth, state.depth + 1);
        c(node.body, { depth: state.depth + 1 });
      },
      SwitchCase(node: any, state: any, c: any) {
        if (node.test) cyclomaticComplexity++;
        c(node.consequent, state);
      },
      VariableDeclarator(node: any, state: any, c: any) {
        if (node.id.type === 'Identifier') {
          variables.add(node.id.name);
        }
        if (node.init) c(node.init, state);
      },
      Identifier(node: any) {
        usedVariables.add(node.name);
      }
    });

    // Simple heuristic for function length if loc is missing
    if (functionLines === 0) {
      functionLines = code.split('\n').length;
    }

    const unusedVariables = Array.from(variables).filter(v => !usedVariables.has(v));

    if (cyclomaticComplexity > 10) suggestions.push("Consider breaking down complex functions into smaller ones.");
    if (maxDepth > 4) suggestions.push("High nesting detected. Try using early returns or guard clauses.");
    if (unusedVariables.length > 0) suggestions.push(`Found ${unusedVariables.length} unused variables: ${unusedVariables.join(', ')}`);

    return {
      cyclomaticComplexity,
      functionLength: functionLines,
      nestedDepth: maxDepth,
      unusedVariables,
      suggestions
    };
  } catch (err: any) {
    console.error("JS Parse Error:", err);
    return {
      cyclomaticComplexity: 0,
      functionLength: 0,
      nestedDepth: 0,
      unusedVariables: [],
      suggestions: ["Failed to parse JavaScript code. Please check for syntax errors."]
    };
  }
}
