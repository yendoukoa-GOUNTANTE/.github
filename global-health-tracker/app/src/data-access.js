import { loadData } from './data';
import { Country, HealthExpenditure } from './model';

export const getHealthExpenditureData = async () => {
  const rawData = await loadData();

  const countries = rawData.map((row) => {
    const country = new Country(row.countryName, row.countryCode);
    country.healthExpenditure = row.values.map(
      (value) => new HealthExpenditure(value.year, value.value)
    );
    return country;
  });

  return countries;
};
