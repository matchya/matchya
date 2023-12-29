module.exports = {
  writerOpts: {
    transform: (commit, context) => {
    if (commit.scope === 'authentication') {
        return commit;
    }
    return false;
    }
  }
};
