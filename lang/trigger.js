function debounce(fn, delay) {
    let args = arguments,
        context = this,
        timer = null;

    return function () {
        if (timer) {
            clearTimeout(timer);

            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        } else {
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        }
    }
}


function throttle(fn, delay) {
    let args = arguments,
        context = this,
        timer = null,
        remaining = 0,
        previous = new Date();

    return function () {
        let now = new Date();
        remaining = now - previous;

        if (remaining >= delay) {
            if (timer) {
                clearTimeout(timer);
            }

            fn.apply(context, args);
            previous = now;
        } else {
            if (!timer) {
                timer = setTimeout(function () {
                    fn.apply(context, args);
                    previous = new Date();
                }, delay - remaining);
            }
        }
    };
}

module.exports = {
    debounce,
    throttle
}
