import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'acorn';
import { simple as walkSimple } from 'acorn-walk';

interface HalsteadMetrics {
    eta1: number; // Number of distinct operators
    eta2: number; // Number of distinct operands
    N1: number;   // Total number of operators
    N2: number;   // Total number of operands
}

// Operators and operands tracking
function calculateMetrics(content: string): HalsteadMetrics {
    const operatorsSet = new Set<string>();
    const operandsSet = new Set<string>();
    let N1 = 0; // Total operators count
    let N2 = 0; // Total operands count

    const ast = parse(content, { ecmaVersion: 'latest' });

    walkSimple(ast, {
        // Operators (arithmetic, logical, assignment, etc.)
        BinaryExpression(node) {
            operatorsSet.add(node.operator);
            N1++; // Counting operators
        },
        UnaryExpression(node) {
            operatorsSet.add(node.operator);
            N1++;
        },
        LogicalExpression(node) {
            operatorsSet.add(node.operator);
            N1++;
        },
        AssignmentExpression(node) {
            operatorsSet.add(node.operator);
            N1++;
        },
        // Operands (identifiers, literals)
        Identifier(node) {
            operandsSet.add(node.name);
            N2++; // Counting operands
        },
        Literal(node) {
            operandsSet.add(String(node.value));
            N2++;
        }
    });

    return {
        eta1: operatorsSet.size, // Number of distinct operators
        eta2: operandsSet.size,  // Number of distinct operands
        N1,                      // Total number of operators
        N2                       // Total number of operands
    };
}

function calculateTimeToProgram(metrics: HalsteadMetrics): number {
    const { eta1, eta2, N1, N2 } = metrics;

    // Program vocabulary: η = η1 + η2
    const eta = eta1 + eta2;

    // Program length: N = N1 + N2
    const N = N1 + N2;

    // Calculated estimated program length: N^ = η1 * log2(η1) + η2 * log2(η2)
    const estimatedN = eta1 * Math.log2(eta1 || 1) + eta2 * Math.log2(eta2 || 1);

    // Volume: V = N * log2(η)
    const volume = N * Math.log2(eta || 1);

    // Difficulty: D = (η1 / 2) * (N2 / η2)
    const difficulty = (eta1 / 2) * (N2 / (eta2 || 1));

    // Effort: E = D * V
    const effort = difficulty * volume;

    // Time to program: T = E / 18 (in seconds) -> 1 / 3600 (in hours)
    const timeToProgram = effort / (18 * 3600);

    return timeToProgram;
}

function getJavaScriptFiles(dir: string): string[] {
    let files: string[] = [];

    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            files = files.concat(getJavaScriptFiles(filePath));
        } else if (filePath.endsWith('.js')) {
            files.push(filePath);
        }
    });

    return files;
}

// Main function that calculates the normalized time and returns the appropriate result
export function calculateTotalTime(directory: string): number {
    const time_max = 100;  // Locally defined time_max

    const jsFiles = getJavaScriptFiles(directory);
    let totalTime = 0;

    jsFiles.forEach(filePath => {
        const content = fs.readFileSync(filePath, 'utf-8');
        const metrics = calculateMetrics(content);
        const time = calculateTimeToProgram(metrics);
        totalTime += time;
    });

    // Return 0 if totalTime exceeds time_max, otherwise return 1 - (totalTime / time_max)
    if (totalTime > time_max) {
        return 0;
    } else {
        return 1 - totalTime / time_max;
    }
}