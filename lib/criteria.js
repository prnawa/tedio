// Eq, Gt, Lt, And, NotEq, IsNull, IsNotNull, In, Or, Like, NotLike, between

// criteria.create()
//     .add(expr.Eq("Email", "test@q.com"))
//     .add(expr.In("Age", [1, 2, 3, 4]))
//     .add(expr.Disjunction()
//         .add(expr.Eq("Email", "test@q.com"))
//         .add(expr.Eq("Address", "cecil street")));


// Email = 'test@q.com' AND Age in (1, 2, 3) OR ()

var addRestriction = function(expression) {
    this.restrictions.push(expression);
    return this;
};

var getCriteria = function() {
    return {
        restrictions: [],
        add: addRestriction
    };
}


module.exports = {
    create: getCriteria
};