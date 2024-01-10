module.exports = {
    writerOpts: {
      transform: (commit, context) => {
      if (commit.scope === 'candidate') {
          return commit;
      }
      return false;
      }
    }
  };
  