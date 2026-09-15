import { faker } from '@faker-js/faker';

export const getRandomNumberInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomFirstName = (): string => {
  return faker.person.firstName();
};

export const getRandomLastName = (): string => {
  return faker.person.lastName();
};

export const getRandomEmail = (): string => {
  return faker.internet.email();
}

export const getRandomPassword = (length: number = 8): string => {
  const upper = faker.string.alpha({ length: 2, casing: 'upper' });
  const lower = faker.string.alpha({ length: 2, casing: 'lower' });
  const numbers = faker.string.numeric(2);
  const special = faker.helpers.arrayElements(['!', '@', '#', '$', '%', '^', '&', '*'], 2).join('');
  const rest = faker.internet.password({ length: length - 8, pattern: /[A-Za-z0-9]/ });
  return faker.helpers.shuffle([...upper, ...lower, ...numbers, ...special, ...rest]).join('');
};

export const getRandomCountry = (): string => {
  return faker.location.country();
}

export const getRandomCity = (): string => {
  return faker.location.city();
}

export const getRandomAddress = (): string => {
  return faker.location.streetAddress();
}

export const getRandomZipCode = (): string => {
  return faker.location.zipCode();
}

export const getRandomPhoneNumber = (): string => {
  return faker.string.numeric(10);
}