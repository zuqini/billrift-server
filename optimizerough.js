var matrix = [
    [0, 0, 2, 4],
    [6, 0, 6, 0],
    [0, 0, 0, 0],
    [0, 9, 6, 0]
];

var print = function(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] !== 0) {
                console.log("Person " + i + " owes person " + j + " " + matrix[i][j] + " dollars");
            }
        }
    }
};

print(matrix);

// Two nodes should only have a single edge between them
var singlefyMatrix = function(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            let ij = matrix[i][j];
            let ji = matrix[j][i];
            if (ij > 0 && ji > 0) {
                if (ij > ji) {
                    matrix[i][j] -= matrix[j][i];
                    matrix[j][i] = 0;
                } else {
                    matrix[j][i] -= matrix[i][j];
                    matrix[i][j] = 0;
                }
            }
        }
    }
};

singlefyMatrix(matrix);
console.log('');
print(matrix);

// Check if a node is the start of a path of length 2
var hasDouble = function(matrix, i) {
    for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] !== 0) {
            for (let k = 0; k < matrix[i].length; k++) {
                if (matrix[j][k] != 0) {
                    return {
                        has: true,
                        j: j,
                        k: k
                    };
                }
            }
        }
    }
    return {
        has: false
    };
};

// Add a debt between person i and person j
var addDebt = function(matrix, i, j, amount) {
    if (matrix[j][i] > 0) {
        matrix[j][i] -= amount;
        if (matrix[j][i] < 0) {
            matrix[i][j] += Math.abs(matrix[j][i]);
            matrix[j][i] = 0;
        }
    } else {
        matrix[i][j] += amount;
    }
};

// Make graph only two levels deep
var optimize = function(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        while (hasDouble(matrix, i).has) {
            let obj = hasDouble(matrix, i);
            console.log(i, obj.j, obj.k, matrix[i][obj.j], matrix[obj.j][obj.k]);
            let j = obj.j;
            let k = obj.k;
            let x = matrix[i][j];
            let y = matrix[j][k];

            matrix[i][j] = 0;
            matrix[j][k] = 0;

            if (x > y) {
                matrix[i][j] = x - y;
                addDebt(matrix, i, k, y);
            } else if (x < y) {
                matrix[j][k] = y - x;
                addDebt(matrix, i, k, x);
            } else if (x === y) {
                addDebt(matrix, i, k, x);
            }
        }
    }
};

optimize(matrix);
print(matrix);
