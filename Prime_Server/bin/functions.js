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
    for(let i=start;i<=end;i++){    // for each number in [start,end] check if it is prime or not
        if(isPrime(i)){
            primes.push(i); // if it is prime then push it in primes array
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
    sieve[0]=false,sieve[1]=false;  // mark 0 and 1 as false
    for(let i=2;i<=end;i++){
        sieve[i]=true;          // mark all the indices from 2 to end as true
    }
    for(let i=2;i*i<=end;i++)
    {
        if(sieve[i])            // if ith index is marked true
        {
            for(let j=2*i;j<=end;j+=i)
            {
                sieve[j]=false;     // mark all the multiples of i as false
            }
        }
    }
    for(let i=2;i<sieve.length;i++){
        if(sieve[i]&&i>=start)      // if the current index is marked as is included in range
            primes.push(i);         // then push it in primes array
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

function segmentedSieve(start,end){
    
    start=Number(start);
    end=Number(end);

    if(isNaN(start)||isNaN(end)) throw new TypeError(typeErrMessage);
    
    if((end-start) > 10**6) throw new Error(wrongAlgoErr);

    if(start>end) throw new RangeError(errMessage);
    
    var primes=findPrimesSieve(0,Math.ceil(Math.sqrt(end)));    // find all primes in range [0,sqrt(end)]
    var sieve=[];
    for(let i=0;i<end-start+1;i++){
        sieve[i]=true;              // mark all elements in range [0,end-start+1] as true
    }
    
    for(const p of primes){
        var lowlim=Math.floor(start/p)*p;       // calculate lowlim (smallest multiple of p>=start)
        if(lowlim<start) lowlim+=p;
        for(let i=lowlim;i<=end;i+=p){
            if(i>=start)
                sieve[i-start]=false;   // mark all multiple of p as false in range [start,end]
        }
    }
    primes=[];
    for(let i=start;i<=end;i++){
        if(sieve[i-start]) primes.push(i);  // push all the marked indices in range [start,end] in primes array
    }
    return primes;
}

// error messages based on the error
const errMessage="End must be greater than or equal to Start!!";
const typeErrMessage='Input must be numbers';
const wrongAlgoErr='Selected Algorithm is not suitable for the given input';

module.exports={
    naivePrimes,
    findPrimesSieve,
    segmentedSieve
};