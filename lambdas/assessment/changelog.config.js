module.exports = {
    writerOpts: {
      transform: (commit, context) => {
      if (commit.scope === 'test') {
          return commit;
      }
      return false;
      }
    }
  };
  