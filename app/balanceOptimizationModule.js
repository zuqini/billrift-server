/*
balanceOptimizationModule.js
Service
Reference number: 2.9
This service provides an interface through which the groups controller can
easily generate the balances given a collection of transactions
*/
var BalanceOptimizationModule = {
    buildMatrix: function(transactions) {
        var matrix = [];
        var indices = {};
        var id = 0;
        for (var i = 0; i < transactions.length; i++) {
            if (indices[transactions[i].userFromId] === undefined) indices[transactions[i].userFromId] = id++;
            if (indices[transactions[i].userToId] === undefined) indices[transactions[i].userToId] = id++;

            var fromId = indices[transactions[i].userFromId];
            var toId = indices[transactions[i].userToId];

            matrix[fromId] = matrix[fromId] || [];
	        matrix[fromId][toId] = matrix[fromId][toId] || 0;
            matrix[fromId][toId] += transactions[i].amount;
        }

        // id represents the number of users i.e. size of matrix
        var length = id;

    	for (i = 0; i < length; i++) {
    	    for (var j = 0; j < length; j++) {
                matrix[i] = matrix[i] || [];
    		    matrix[i][j] = matrix[i][j] || 0;
    	    }
    	}

        return {matrix, indices};
    },

    directMatrix: function(matrix) {
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                var ij = matrix[i][j];
                var ji = matrix[j][i];
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
    },

    hasDouble: function(matrix, i) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] !== 0) {
                for (var k = 0; k < matrix[i].length; k++) {
                    if (matrix[j][k] !== 0) {
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
    },

    addDebt: function(matrix, i, j, amount) {
        if (matrix[j][i] > 0) {
            matrix[j][i] -= amount;
            if (matrix[j][i] < 0) {
                matrix[i][j] += Math.abs(matrix[j][i]);
                matrix[j][i] = 0;
            }
        } else {
            matrix[i][j] += amount;
        }
    },

    optimizeMatrix: function(matrix) {
        for (var i = 0; i < matrix.length; i++) {
            while (true) {
                var obj = this.hasDouble(matrix, i);
                if (!obj.has) break;
                var j = obj.j;
                var k = obj.k;
                var x = matrix[i][j];
                var y = matrix[j][k];

                matrix[i][j] = 0;
                matrix[j][k] = 0;

                if (x > y) {
                    matrix[i][j] = x - y;
                    this.addDebt(matrix, i, k, y);
                } else if (x < y) {
                    matrix[j][k] = y - x;
                    this.addDebt(matrix, i, k, x);
                } else if (x === y) {
                    this.addDebt(matrix, i, k, x);
                }
            }
        }
    }
};

module.exports = BalanceOptimizationModule;
