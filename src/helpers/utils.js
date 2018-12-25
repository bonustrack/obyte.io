const Mnemonic = require('bitcore-mnemonic');

const generateRandomSeed = () => {
  let mnemonic = new Mnemonic();
  while (!Mnemonic.isValid(mnemonic.toString())) {
    mnemonic = new Mnemonic();
  }
  return mnemonic.phrase;
};

const isSeedValid = seed => Mnemonic.isValid(seed);

const getUnspent = (history, addresses) => {
  const unspent = [];
  if (history.joints) {
    const joints = history.joints.slice().reverse()
      .concat(history.unstable_mc_joints.slice().reverse());
    joints.forEach((joint) => {
      joint.unit.messages.forEach((message, messageIndex) => {
        if (message.payload && message.payload.inputs) {
          message.payload.inputs.forEach((input) => {
            const unspentIndex = unspent.findIndex(u => (
              u.unit === input.unit
              && u.output_index === input.output_index
              && u.message_index === input.message_index
            ));
            if (unspentIndex >= 0) {
              unspent.splice(unspentIndex, 1);
            }
          });
        }
        if (message.payload && message.payload.outputs) {
          message.payload.outputs.forEach((output, outputIndex) => {
            if (addresses.includes(output.address)) {
              unspent.push({
                address: output.address,
                amount: output.amount,
                asset: message.payload.asset ? message.payload.asset : null,
                message_index: messageIndex,
                output_index: outputIndex,
                unit: joint.unit.unit,
              });
            }
          });
        }
      });
    });
  }
  return unspent;
};

const getBalances = (unspent) => {
  const balances = {};
  unspent.forEach((u) => {
    const asset = u.asset ? u.asset : 'bytes';
    balances[asset] = (!balances[asset]) ? u.amount : balances[asset] + u.amount;
  });
  return balances;
};

export default {
  generateRandomSeed,
  isSeedValid,
  getUnspent,
  getBalances,
};
