/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)"],
  maxConcurrency: 5
};