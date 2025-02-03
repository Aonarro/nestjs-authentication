export const parseBoolean = (value: string): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    const forrmattedValue = value.toLowerCase().trim();

    if (forrmattedValue === 'true') {
      return true;
    }

    if (forrmattedValue === 'false') {
      return false;
    }

    throw new Error(`Invalid boolean value: ${value}`);
  }
};
