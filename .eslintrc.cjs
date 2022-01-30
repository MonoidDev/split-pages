const { setRulesDir, config } = require('@monoid/utils.eslint.config');
setRulesDir('./scripts/rules');

module.exports = config;
