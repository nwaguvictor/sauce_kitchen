// Catch async/await functions
exports.asyncWrapper = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}