module.exports = {
    writerOpts: {
      transform: (commit, context) => {
      if (commit.scope === 'question') {
          return commit;
      }
      return false;
      }
    }
  };
  