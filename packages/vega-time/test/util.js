module.exports = {
  local: (y, m, d, H, M, S, L) => new Date(y, m||0, d||1, H||0, M||0, S||0, L||0),
  utc: (y, m, d, H, M, S, L) => new Date(Date.UTC(y, m||0, d||1, H||0, M||0, S||0, L||0))
};
