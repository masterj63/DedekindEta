// SECTION: var

var MAX_N = 200;
var EPS_SQR = 0;
var ZERO_C = math.complex(0, 0);
var seriesDescription = {
    "23_1": [23, 24],
    "22_2": [11, 12],
    "21_3": [7, 8],
    "20_4": [5, 6],
    "18_6": [3, 4],
    "16_8": [2, 3],
    "12_12": [1, 2]
};


// SECTION: function

getHref = function(re, im, elementId) {
    var a = elementId.substring(0, 2);
    var b = elementId.substring(3);
    
    var s = re.toString();
    if(im >= 0)
        s += "%2B";
    s += im.toString() + "*i";
    var pref = "http://www.wolframalpha.com/input/?i=DedekindEta%5B" + a + "*%28";
    var mid = "%29%5D*DedekindEta%5B" + b + "*%28";
    return pref + s + mid + s + "%29%5D"
}

formatC = function(c) {
    return "re= " + c.re + "<br>" + "im= " + c.im + "<br><br>";
}

moduleCSqr = function(c) {
    return c.re*c.re + c.im*c.im;
}

/**
 * Given (complex) z and (integer) a, b.
 * Computes sum of series \sum_{m,n=-\infty}^{\infty} (-1)^{m+n} * q(_z_)^{((6m+1)^2 + _a_*(6n+1)^2) / _b_},
 * where q(_z_) = \exp(2*pi*i*z).
 */
compute = function(z, a, b) {
    //window.alert(MAX_N);
    var q = math.exp(math.multiply(math.multiply(math.i, z), 2 * math.pi));
    var sum = math.complex(0, 0);
    
    for (var n = -MAX_N; n <= MAX_N; n++) {
        for (var m = -1; m >= -MAX_N; m--) {
            var st = seriesTerm(q, m, n, a, b);
            sum = math.add(sum, st);
            /*if (moduleCSqr(st) < EPS_SQR)
                break;*/
        }
        for (var m = 0; m <= MAX_N; m++) {
            var st = seriesTerm(q, m, n, a, b);
            sum = math.add(sum, st);
            /*if (moduleCSqr(st) < EPS_SQR)
                break;*/
        }
    }
    
    return sum;
}

seriesTerm = function(q, m, n, a, b) {
    var s = ((6*m+1)*(6*m+1) + a*(6*n+1)*(6*n+1)) / b;
    var t = math.pow(q, s);
    if (isNaN(t.re) || isNaN(t.im))
        return ZERO_C;
    if ((m + n) % 2 == 0)
        return t;
    else
        return math.multiply(t, -1);
}

/**
 * Given (string) str. Returns `true` iff str represents a correct float.
 * `Correct` means with no leading zeros, letters, punctuation marks (except decimal delimiter).
 * Honestly, there might be a better implementation of this since I am not a js dev and I do not mess with all that broken javascript NaN staff.
 */
isFloatParseable = function(str) {
    var sFloat = parseFloat(str);
    var sString = sFloat.toString();
    return sString != 'NaN' && sString == str;
}

/**
 * Operates on <input>s of `Re(z)`, `Im(z)` to change their colors.
 */
setBackground = function(input, color) {
    input.style.backgroundColor = color;
}

/**
 * See [setBackground].
 */
setBackgroundRed = function(input) {
    setBackground(input, "red")
}

/**
 * See [setBackground].
 */
setBackgroundWhite = function(input) {
    setBackground(input, "white")
}

updateSeries = function() {
    var reInput = document.getElementById("re_z");
    var re_z = reInput.value;
    var reIsGood = isFloatParseable(re_z);
    if (reIsGood)
        setBackgroundWhite(reInput);
    else
        setBackgroundRed(reInput);
    
    var imInput = document.getElementById("im_z");
    var im_z = imInput.value;
    var imIsGood = isFloatParseable(im_z);
    if (imIsGood)
        setBackgroundWhite(imInput);
    else
        setBackgroundRed(imInput);
    
    var maxNInput = document.getElementById("max_n");
    var maxN = maxNInput.value;
    var maxNIsGood = isFloatParseable(maxN);
    if (maxNIsGood)
        setBackgroundWhite(maxNInput);
    else
        setBackgroundRed(maxNInput);
    MAX_N = maxN;
    
    if (!reIsGood || !imIsGood || !maxNIsGood)
        return;
    
    re_z = parseFloat(re_z);
    im_z = parseFloat(im_z);
    var z = math.complex(re_z, im_z);
    
    for (var elementId in seriesDescription) {
        if (!document.getElementById("cb" + elementId).checked) {
            document.getElementById(elementId).innerHTML = "?";
            continue;
        }
        var ab = seriesDescription[elementId];
        var a = ab[0];
        var b = ab[1];
        document.getElementById("a" + elementId).href = getHref(re_z, im_z, elementId);
        document.getElementById(elementId).innerHTML = formatC(compute(z, a, b));
    }
}

