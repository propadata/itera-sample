'use strict';

const Itera = require('itera');

const internals = {
    errorStatus: false
};


const step1 = function () {

    return new Promise((resolve, reject) => {

        if (internals.errorStatus === 'step1') {
            reject(new Error('step1 failed'));
        }

        resolve('SUCCESS: Get Path');
    });
};

const step2 = function () {

    return new Promise((resolve, reject) => {

        if (internals.errorStatus === 'step2') {
            reject(new Error('step2 failed'));
        }

        resolve('SUCCESS: Get FileName');

    });
};

const step3 = function (test) {

    return new Promise((resolve, reject) => {

        if (internals.errorStatus === 'step3') {
            internals.errorStatus = null;
            reject(new Error('step3 failed'));
        }

        resolve('SUCCESS: yielded all promises');
    });
};


const Generator = function * (callback) {

    // ERRORS AND YIELDING PROMISES
    // if a promise executes and resolves with an error.
    // The value of the error resolution "reject()" is place in the
    // variable associated with the yield at the execution of the next
    // promise.


    const result1 = yield step1(internals.errorStatus);

    if (result1 instanceof Error) {

        // console.log(typeof result1);
        // console.log(result1.message);
        // console.log(result1.name);
        // console.log('ERROR');
        return callback(result1, null);
    }

    // console.log(result1);

    const result2 = yield step2(internals.errorStatus);

    if ( (result2.name !== undefined) && (result2.name === 'Error')) {

        // console.log(typeof result2);
        // console.log(result2.message);
        // console.log(result2.name);
        // console.log('ERROR');
        return callback(result2, null); // return stops generator & callback executes.
    }

    // console.log(result2);
    // return; exits generator early if error exists.


    const result3 = yield step3(internals.errorStatus);

    if ( (result3.name !== undefined) && (result3.name === 'Error')) {

        // console.log(step3Result.message);
        // console.log(step3Result.name);
        // console.log(result3);
        // console.log('ERROR');
        return callback(result3, null); // return stops generator & callback executes.
    }

    // console.log(result3);

    return callback(null, result3);
};

Itera(Generator, function (err, result) {

    console.log('DONE: ' + err + '  ' + result);
});
