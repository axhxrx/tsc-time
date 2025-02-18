/**
 FizzBuzz function that returns a string based on the number. If the number is divisible by 3, return 'fizz'. If the number is divisible by 5, return 'buzz'. If the number is divisible by both 3 and 5, return 'fizzbuzz'. Otherwise, return the number as a string.
 */
export function fizzBuzz(num: number): string
{
  if (num === 5)
  {
    console.log('BTW this next number is objectively the best number!');
  }
  else if (num === 55)
  {
    console.log('This next number is also good!');
  }
  else if ([88, 47].includes(num))
  {
    console.log('This next number sucks major ass 👎');
  }
  return num % 3 === 0 && num % 5 === 0 ? 'fizzbuzz' : num % 3 === 0 ? 'fizz' : num % 5 === 0 ? 'buzz' : String(num);
}
