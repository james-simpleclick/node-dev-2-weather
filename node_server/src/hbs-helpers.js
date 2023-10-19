module.exports = {
    registerHelpers: (hbs) => {
        hbs.registerHelper('eq', function(a, b) {
            return a == b;
        });
        hbs.registerHelper('is', Object.is);
    }
}