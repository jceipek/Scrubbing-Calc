var dx = 0.000001;
var tolerance = 0.00001;

var fixed_point = function(f, first_guess) {
    var close_enough = function(v1, v2) {
        return Math.abs(v1 - v2) < tolerance;
    }

    var try_it = function(guess) {
        var next = f(guess);
        if (close_enough(guess, next)) {
            return next;
        }
        else {
            return try_it(next);
        }
    }

    return try_it(first_guess);
}


var deriv = function(g) {
    return function(x){
        return ( g(x + dx) - g(x) ) / dx;
    }
}

var y = function(x) {
    return (x - 5) * (x + 10);
}

var newton_transform = function(g) {
    return function(x) {
        return x - ( g(x) / deriv(g)(x) );
    }
}

var newtons_method = function(g, guess) {
    return fixed_point(newton_transform(g), guess);
}