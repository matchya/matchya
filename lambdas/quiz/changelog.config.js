module.exports = {
    writerOpts: {
      transform: (commit, context) => {
      if (commit.scope === 'quiz') {
          return commit;
      }
      return false;
      }
    }
  };
  