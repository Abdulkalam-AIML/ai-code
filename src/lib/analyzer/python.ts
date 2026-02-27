// Note: In a real serverless environment, we might use a python runtime if available.
// However, to keep it "Fully on Vercel" without external backends, we use a JS-based Python parser.
import { analyze } from 'py-ast';

export interface AnalysisResult {
    cyclomaticComplexity: number;
    functionLength: number;
    nestedDepth: number;
    unusedVariables: string[];
    suggestions: string[];
}

export function analyzePython(code: string): AnalysisResult {
    let cyclomaticComplexity = 1;
    let maxDepth = 0;
    let functionLines = 0;
    const variables = new Set<string>();
    const usedVariables = new Set<string>();
    const suggestions: string[] = [];

    try {
        // py-ast is a lightweight parser that mimics the Python AST structure
        const ast = analyze(code);

        const traverse = (node: any, depth: number) => {
            if (!node) return;

            maxDepth = Math.max(maxDepth, depth);

            // Branching points
            if (['If', 'While', 'For', 'And', 'Or', 'ExceptHandler'].includes(node.type)) {
                cyclomaticComplexity++;
            }

            // Function/Class definitions
            if (node.type === 'FunctionDef' || node.type === 'AsyncFunctionDef') {
                const lines = (node.lineno_end || 0) - (node.lineno || 0);
                functionLines += lines;
            }

            // Variables (Assign)
            if (node.type === 'Assign') {
                node.targets?.forEach((t: any) => {
                    if (t.id) variables.add(t.id);
                });
            }

            // Usage
            if (node.type === 'Name' && node.ctx === 'Load') {
                usedVariables.add(node.id);
            }

            // Recursively traverse children
            for (const key in node) {
                const child = node[key];
                if (Array.isArray(child)) {
                    child.forEach(c => traverse(c, depth + 1));
                } else if (child && typeof child === 'object' && child.type) {
                    traverse(child, depth + 1);
                }
            }
        };

        traverse(ast, 0);

        const unusedVariables = Array.from(variables).filter(v => !usedVariables.has(v));

        if (cyclomaticComplexity > 10) suggestions.push("Python function complexity is high. Consider using refactoring to split logic.");
        if (maxDepth > 5) suggestions.push("Deep nesting in Python detected. Flatten your structure using list comprehensions or early returns.");
        if (unusedVariables.length > 0) suggestions.push(`Unused Python variables: ${unusedVariables.join(', ')}`);

        return {
            cyclomaticComplexity,
            functionLength: functionLines || code.split('\n').length,
            nestedDepth: maxDepth,
            unusedVariables,
            suggestions
        };
    } catch (err) {
        console.error("Python Parse Error:", err);
        return {
            cyclomaticComplexity: 0,
            functionLength: 0,
            nestedDepth: 0,
            unusedVariables: [],
            suggestions: ["Failed to parse Python code. Make sure it's valid Python 3 syntax."]
        };
    }
}
