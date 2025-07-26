// 最长公共子序列 (Longest Common Subsequence)

/**
 * 动态规划解法 - 时间复杂度 O(m*n)，空间复杂度 O(m*n)
 * @param {string} text1 
 * @param {string} text2 
 * @returns {number}
 */
function longestCommonSubsequence(text1, text2) {
    const m = text1.length;
    const n = text2.length;
    
    // 创建二维数组，dp[i][j] 表示 text1[0...i-1] 和 text2[0...j-1] 的最长公共子序列长度
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                // 如果当前字符相等，则最长公共子序列长度加1
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                // 如果当前字符不相等，取左边或上边的最大值
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}

/**
 * 递归解法（带记忆化）- 时间复杂度 O(m*n)，空间复杂度 O(m*n)
 * @param {string} text1 
 * @param {string} text2 
 * @returns {number}
 */
function longestCommonSubsequenceRecursive(text1, text2) {
    const m = text1.length;
    const n = text2.length;
    const memo = Array(m).fill().map(() => Array(n).fill(-1));
    
    function dfs(i, j) {
        if (i === m || j === n) return 0;
        
        if (memo[i][j] !== -1) return memo[i][j];
        
        if (text1[i] === text2[j]) {
            memo[i][j] = dfs(i + 1, j + 1) + 1;
        } else {
            memo[i][j] = Math.max(dfs(i + 1, j), dfs(i, j + 1));
        }
        
        return memo[i][j];
    }
    
    return dfs(0, 0);
}

/**
 * 获取最长公共子序列的具体内容
 * @param {string} text1 
 * @param {string} text2 
 * @returns {string}
 */
function getLongestCommonSubsequence(text1, text2) {
    const m = text1.length;
    const n = text2.length;
    
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    // 填充dp数组
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (text1[i - 1] === text2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    // 回溯构建最长公共子序列
    const result = [];
    let i = m, j = n;
    
    while (i > 0 && j > 0) {
        if (text1[i - 1] === text2[j - 1]) {
            result.unshift(text1[i - 1]);
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }
    
    return result.join('');
}

// 测试用例
function testLCS() {
    const testCases = [
        { text1: "abcde", text2: "ace", expected: 3 },
        { text1: "abc", text2: "abc", expected: 3 },
        { text1: "abc", text2: "def", expected: 0 },
        { text1: "bsbininm", text2: "jmjkbkjkv", expected: 1 },
        { text1: "pmjghexybyrgzczy", text2: "hafcdqbgncrcbihkd", expected: 4 }
    ];
    
    console.log("=== 最长公共子序列测试 ===");
    
    testCases.forEach((testCase, index) => {
        const { text1, text2, expected } = testCase;
        
        const dpResult = longestCommonSubsequence(text1, text2);
        const recursiveResult = longestCommonSubsequenceRecursive(text1, text2);
        const sequence = getLongestCommonSubsequence(text1, text2);
        
        console.log(`测试用例 ${index + 1}:`);
        console.log(`  字符串1: "${text1}"`);
        console.log(`  字符串2: "${text2}"`);
        console.log(`  动态规划结果: ${dpResult}`);
        console.log(`  递归结果: ${recursiveResult}`);
        console.log(`  最长公共子序列: "${sequence}"`);
        console.log(`  期望结果: ${expected}`);
        console.log(`  测试通过: ${dpResult === expected && recursiveResult === expected}`);
        console.log("---");
    });
}

// 运行测试
testLCS();

// 导出函数供其他模块使用
module.exports = {
    longestCommonSubsequence,
    longestCommonSubsequenceRecursive,
    getLongestCommonSubsequence
};
