const { workerData, parentPort } = require('worker_threads')
const performance=require('performance-now');

/**
 * Selects Appropriate algorithm based on the choice of user
 * 
 * @param {Number} start    The First Number in the range
 * @param {Number} end      The Last Number in the range
 * @param {Number} algo     The Algorithm to be used for computation
 * @returns {Object}        computed result along with elapsed time and algorithm used
 * 
 */

function resolve(start, end, algo) {
    var ans = null;
    var startTime = performance();
    //var startTime=process.hrtime();
    let choice = null;
    try {
        if (start === undefined || end === undefined || algo === undefined)
            throw new Error('Improper params');
        switch (Number(algo)) {
            case 1:
                ans = naivePrimes(start, end);
                choice = 'Naive Prime';
                break;
            case 2:
                ans = findPrimesSieve(start, end);
                choice = 'Sieve of Eratosthenes';
                break;
            case 3:
                ans = segmentedSieve(start, end);
                choice = 'Segmented Sieve';
                break;
            default:
                ans = null;
        }
    }
    catch (err) {
        const errObj = {
            error: {
                type: err.name,
                message: err.message,
                status: 422
            }
        };
        return errObj;
    }
    var elapsedSecond = performance() - startTime;
    return [ans, elapsedSecond, choice];
}

/**
 * 
 * @param {Number} num  Number to check wheather it's prime or not
 * @returns true if the number is prime and false otherwise.
 */
function isPrime(num) {
    if(num<2) return false;
    for(let i=2;i*i<=num;i++){
        if(num%i==0){
            return false;
        }
    }
    return true;
}
/**
 * Compute prime numbers in the given rage using naive algorithm.
 * Time complexity O(N*sqrt(N)), where N the length of range.
 * @param {Number} start    The first number in the range
 * @param {Number} end      The last number in the range
 * @returns Array of prime numbers in the given range
 * @throws {TypeError} if params are not Numbers
 * @throws {RangeError} if start > end
 * @throws {Error} if end > 10^6
 */
function naivePrimes(start,end) {
    
    start=Number(start);
    end=Number(end);
    
    if(isNaN(start)||isNaN(end)) throw new TypeError(typeErrMessage);
    
    if(end>10**6) throw new Error(wrongAlgoErr);
    
    if(start>end) throw new RangeError(errMessage);
    
    primes=[];
    for(let i=start;i<=end;i++){
        if(isPrime(i)){
            primes.push(i);
        }
    }
    return primes;
}
/**
 * Compute prime numbers in the given range using Sieve of Eratosthenes algorithm
 * Time complexity O(Nlog(log(N))), where N is the largest number in the range
 * @param {Number} start The first number in the range
 * @param {Number} end The last number in the range
 * @returns Array of prime numbers in the given range
 * @throws {TypeError} if params are not Numbers
 * @throws {RangeError} if start > end
 * @throws {Error} if end > 10^6
 */
function findPrimesSieve(start,end) {
    
    start=Number(start);
    end=Number(end);
    
    if(isNaN(start)||isNaN(end)) throw new TypeError(typeErrMessage);
    if(end>10**6) throw new Error(wrongAlgoErr);
    
    if(start>end) throw new RangeError(errMessage);
    
    var sieve=[];
    var primes=[];
    sieve[0]=false,sieve[1]=false;
    for(let i=2;i<=end;i++){
        sieve[i]=true;
    }
    for(let i=2;i*i<=end;i++)
    {
        if(sieve[i])
        {
            for(let j=2*i;j<=end;j+=i)
            {
                sieve[j]=false;
            }
        }
    }
    for(let i=2;i<sieve.length;i++){
        if(sieve[i]&&i>=start)
            primes.push(i);
    }
    return primes;
}
/**
 * Compute prime numbers in the given range using Sieve of Eratosthenes algorithm
 * Time complexity O(Nlog(log(N))) + O(sqrt(R)log(log(sqrt(R)))), where N is the range size, R is the largest number in range
 * 
 * @param {Number} start The first number in the range
 * @param {Number} end The last number in the range
 * @returns Array of prime numbers in the given range
 * @throws {TypeError} if params are not Numbers
 * @throws {RangeError} if start > end
 * @throws {Error} if end-start > 10^6
 */
function segmentedSieve(start,end){
    
    start=Number(start);
    end=Number(end);

    if(isNaN(start)||isNaN(end)) throw new TypeError(typeErrMessage);
    
    if((end-start) > 10**6) throw new Error(wrongAlgoErr);

    if(start>end) throw new RangeError(errMessage);
    
    var primes=findPrimesSieve(0,Math.ceil(Math.sqrt(end)));
    var sieve=[];
    for(let i=0;i<end-start+1;i++){
        sieve[i]=true;
    }
    
    for(const p of primes){
        var lowlim=Math.floor(start/p)*p;
        if(lowlim<start) lowlim+=p;
        for(let i=lowlim;i<=end;i+=p){
            if(i>=start)
                sieve[i-start]=false;
        }
    }
    primes=[];
    for(let i=start;i<=end;i++){
        if(sieve[i-start]) primes.push(i);
    }
    return primes;
}

// error messages based on the error
const errMessage="End must be greater than or equal to Start!!";
const typeErrMessage='Input must be numbers';
const wrongAlgoErr='Selected Algorithm is not suitable for the given input';

var ans=resolve(workerData.start,workerData.end,workerData.algo);

// passing computed result to the main thread
parentPort.postMessage(ans);
