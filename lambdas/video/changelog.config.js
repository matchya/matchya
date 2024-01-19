module.exports = {
  writerOpts: {
    transform: (commit, context) => {
      if (commit.scope === "video") {
        return commit;
      }
      return false;
    },
  },
};
