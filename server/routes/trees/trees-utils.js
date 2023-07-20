const convertHealthToNumber = (health) => {
  if (!health) return 6;

  const healthNumber = {
    good: 6,
    fair: 5,
    poor: 4,
    stump: 3,
    missing: 2,
    dead: 1,
    vacant: 0,
  };

  return healthNumber[health];
};

export default convertHealthToNumber;
