export const messages = {
  ["KR"]: {
    join: {
      isNull: {
        select: (key) => `Please enter a ${key}.`,

        age: `Please write down your age properly.`,
        password: `Password does not match.`,
        country: `Please select a country.`,
      },
      success: {
        create: `Your membership registration has been completed.`
      },
      error: {
        duplicate: (key) => `${key} is duplicated. Please select a different ${key}.`
      }
    },
  },
  EN: {},
};
