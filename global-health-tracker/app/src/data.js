import Papa from 'papaparse';

export const loadData = async () => {
  const response = await fetch('/API_SH.XPD.CHEX.GD.ZS_DS2_en_csv_v2_38260.csv');
  const csvData = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      complete: (results) => {
        const data = results.data
          .filter((row) => row['Country Name'])
          .map((row) => {
            const countryName = row['Country Name'];
            const countryCode = row['Country Code'];
            const values = Object.entries(row)
              .filter(([key, value]) => !isNaN(parseInt(key, 10)))
              .map(([year, value]) => ({
                year: parseInt(year, 10),
                value: value,
              }));
            return {
              countryName,
              countryCode,
              values,
            };
          });
        resolve(data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
