module.exports = {
  writerOpts: {
    transform: (commit, context) => {
    if (commit.scope === 'authorizer') {
        return commit;
    }
    return false;
    }
  }
};
