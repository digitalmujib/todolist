
exports.getDate = function(){
    const today = new Date();
    const options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    }
    return today.toLocaleString("en-US", options);
}

// module.exports.getDay or exports.getDay 

exports.getDay = function() {
    const today = new Date();
    const options = {
        weekday: 'long',
    }
    return today.toLocaleString("en-US", options);
}
