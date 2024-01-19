module.exports = {
    writerOpts: {
      transform: (commit, context) => {
      if (commit.scope === 'interview') {
          return commit;
      }
      return false;
      }
    }
  };
  