module.exports = {
  writerOpts: {
    transform: (commit, context) => {
    if (commit.scope === 'position') {
        return commit;
    }
    return false;
    }
  }
};
