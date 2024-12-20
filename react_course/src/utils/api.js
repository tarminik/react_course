const ERROR_PROBABILITY = 0.05;

const simulateError = () => Math.random() < ERROR_PROBABILITY;

export const apiRequest = async (requestFn, requestData) => {
  try {
    if (simulateError()) {
      throw new Error('Random API Error');
    }
    
    const result = await requestFn(requestData);
    return result;
  } catch (error) {
    console.error(
      `%cAPI Error at ${new Date().toISOString()}`,
      'color: red; font-weight: bold;',
      '\nRequest data:', requestData,
      '\nError:', error
    );
    throw error;
  }
};
