module.exports = {
  writerOpts: {
    transform: (commit, context) => {
      if (commit.scope === "assessment") {
        return commit;
      }
      return false;
    },
  },
};
