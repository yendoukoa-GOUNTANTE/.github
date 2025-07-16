import * as tf from '@tensorflow/tfjs';

export const createModel = () => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
  return model;
};

export const trainModel = async (model, data) => {
  const years = data.map((d) => d.year);
  const values = data.map((d) => d.value);

  const xs = tf.tensor2d(years, [years.length, 1]);
  const ys = tf.tensor2d(values, [values.length, 1]);

  await model.fit(xs, ys, { epochs: 250 });
};

export const predict = (model, year) => {
  const prediction = model.predict(tf.tensor2d([year], [1, 1]));
  return prediction.dataSync()[0];
};
