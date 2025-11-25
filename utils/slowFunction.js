
 function getRandomValue(array){
   return array[Math.floor(Math.random() * array.length)];

 }
 function doSomeTasks() {
  const ms = getRandomValue([500, 1000, 1500, 2000, 2500]);
  const throwError = getRandomValue([1, 2, 3, 4, 5]) === 3;
  if(throwError){
    const newError = 
    getRandomValue(["Something went wrong!", "Unable to complete the task.", "An unexpected error occurred."]); 
    throw new Error(newError);
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Task completed in ${ms} `);
    }, ms);
  });
}

module.exports = {
    doSomeTasks,
};