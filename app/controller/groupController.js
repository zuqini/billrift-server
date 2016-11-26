var Group = require('../models/group');
var User = require('../models/user');
var Transaction = require('../models/transaction');
var BOM = require('../balanceOptimizationModule');

module.exports = {
	getBalances(req, res) {
        var groupId = req.params.id;

        if (!groupId) {
            return res.status(400).json({ status: 400, error: "Bad parameters."});
        }

        var query = {
            groupId: groupId
        };
        Transaction.find(query, function(err, transactions) {
            if (err) return res.status(500).json({ status: 500, error: err.toString()});
    	    if(!transactions.length) return res.status(200).json([]);

            var result = BOM.buildMatrix(transactions);

            // console.log("built matrix", result);

            var matrix = result.matrix;
            var indices = result.indices;

            BOM.directMatrix(matrix);
            BOM.optimizeMatrix(matrix);

            // console.log("optimized and directed matrix", matrix);

            var balances = [];
            var reverseIndices = _.invert(indices);
            for (var i = 0; i < matrix.length; i++) {
                for (var j = 0; j < matrix[i].length; j++) {
                    if (matrix[i][j] !== 0) {
                        var fromId = reverseIndices[j];
                        var toId = reverseIndices[i];
                        var amount = matrix[i][j];

                        balances.push({
                                "from": fromId,
                                "to": toId,
                                "amount": amount,
                                "groupId": groupId
                            });
                    }
                }
            }

            res.json(balances);
        });
    }
};
