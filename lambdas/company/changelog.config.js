module.exports = {
  writerOpts: {
    transform: (commit, context) => {
    if (commit.scope === 'company') {
        return commit;
    }
    return false;
    }
  }
};
