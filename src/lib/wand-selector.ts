import data from "../../data.json";

// Length in millimeters to avoid floating point inaccuracies
export const lengths = [230, 360] as const;

/**
 * Selects a random combination of wood, core and length to display a new wand to the user.
 */
export const wandSelector = async () => {
  return {
    wood: data.woodTypes[Math.floor(Math.random() * data.woodTypes.length)],
    core: data.cores[Math.floor(Math.random() * data.cores.length)],
    length: Math.floor(
      Math.random() * (lengths[1] - lengths[0] + 1) + lengths[0]
    ),
  };
};
